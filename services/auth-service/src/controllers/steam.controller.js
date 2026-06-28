/**
 * Steam OpenID 2.0 authentication controller
 * Flow: GET /auth/steam         → redirect to Steam login page
 *       GET /auth/steam/callback → Steam redirects back here → issue JWT
 */
const crypto       = require('crypto');
const config       = require('../config');
const userRepository   = require('../repositories/user.repository');
const tokenRepository  = require('../repositories/token.repository');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const logger = require('../utils/logger');

// Determine the base URL for callbacks
const BASE_URL     = process.env.FRONTEND_URL    || 'http://localhost:5173';
const SERVICE_URL  = process.env.AUTH_SERVICE_URL || `http://localhost:${config.port}`;

// Steam OpenID endpoint
const STEAM_OPENID = 'https://steamcommunity.com/openid/login';

const steamController = {

  // ── Step 1: Redirect user to Steam ──────────────────────────────────────
  redirect: (req, res) => {
    const returnTo  = `${SERVICE_URL}/auth/steam/callback`;
    const realm     = SERVICE_URL;

    const params = new URLSearchParams({
      'openid.ns':         'http://specs.openid.net/auth/2.0',
      'openid.mode':       'checkid_setup',
      'openid.return_to':  returnTo,
      'openid.realm':      realm,
      'openid.identity':   'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    });

    return res.redirect(`${STEAM_OPENID}?${params.toString()}`);
  },

  // ── Step 2: Steam calls back with OpenID assertion ───────────────────────
  callback: async (req, res) => {
    try {
      // Verify the OpenID assertion by re-querying Steam
      const query = { ...req.query };
      query['openid.mode'] = 'check_authentication';

      const verifyRes = await fetch(STEAM_OPENID, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    new URLSearchParams(query).toString(),
      });
      const text = await verifyRes.text();

      if (!text.includes('is_valid:true')) {
        logger.warn('Steam OpenID verification failed');
        return res.redirect(`${BASE_URL}/login?error=steam_invalid`);
      }

      // Extract Steam ID from claimed_id
      // e.g. https://steamcommunity.com/openid/id/76561198XXXXXXXXX
      const claimedId = req.query['openid.claimed_id'] || '';
      const match     = claimedId.match(/\/openid\/id\/(\d+)$/);
      if (!match) {
        return res.redirect(`${BASE_URL}/login?error=steam_id_missing`);
      }
      const steamId = match[1];

      // Fetch Steam profile via Web API (works without API key for basic info)
      let steamProfile = { steamId, personaname: `Steam_${steamId}`, avatar: null };
      try {
        const apiKey = process.env.STEAM_API_KEY;
        if (apiKey) {
          const profileRes  = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
          );
          const profileData = await profileRes.json();
          const player      = profileData?.response?.players?.[0];
          if (player) {
            steamProfile = {
              steamId,
              personaname: player.personaname,
              avatar:      player.avatarfull || player.avatar,
            };
          }
        }
      } catch { /* profile fetch is optional */ }

      // Find or create user by steamId
      let user = await userRepository.findBySteamId(steamId);
      if (!user) {
        const userRole = await userRepository.findOrCreateUserRole();
        // Generate unique username/email from steamId
        const username = `steam_${steamId.slice(-8)}`;
        const email    = `steam_${steamId}@cs2market.local`;

        user = await userRepository.create({
          email,
          username,
          password:  crypto.randomBytes(32).toString('hex'), // random, unusable password
          firstName: steamProfile.personaname,
          lastName:  null,
          steamId,
          avatarUrl: steamProfile.avatar,
          roleId:    userRole.id,
        });
        logger.info(`New Steam user created: ${steamId}`);
      } else {
        // Update avatar if changed
        if (steamProfile.avatar) {
          await userRepository.updateById(user.id, { avatarUrl: steamProfile.avatar });
        }
        logger.info(`Steam user logged in: ${steamId}`);
      }

      // Issue JWT tokens
      const roleName     = user.role?.name || 'User';
      const tokenPayload = { id: user.id, email: user.email, username: user.username, role: roleName };
      const accessToken  = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await tokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });

      // Redirect back to frontend with tokens in query params
      // The frontend will read these and store them
      const redirectUrl = new URL(`${BASE_URL}/steam/callback`);
      redirectUrl.searchParams.set('accessToken',  accessToken);
      redirectUrl.searchParams.set('refreshToken', refreshToken);
      redirectUrl.searchParams.set('steamId',      steamId);

      return res.redirect(redirectUrl.toString());
    } catch (err) {
      logger.error('Steam auth callback error:', err);
      return res.redirect(`${BASE_URL}/login?error=steam_error`);
    }
  },
};

module.exports = steamController;
