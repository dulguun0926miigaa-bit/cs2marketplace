const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../utils/logger');

/**
 * Build a proxy middleware.
 * The gateway does NOT parse the request body — the raw stream is forwarded as-is.
 * pathRewrite: object map { '^/api/auth': '' } OR string prefix to strip.
 */
const buildProxy = (target, pathRewrite) => {
  let rewriteConfig;

  if (typeof pathRewrite === 'string' && pathRewrite) {
    const escaped = pathRewrite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    rewriteConfig = (path) => path.replace(new RegExp(`^${escaped}`), '') || '/';
  } else if (pathRewrite && typeof pathRewrite === 'object') {
    rewriteConfig = (path) => {
      let result = path;
      Object.entries(pathRewrite).forEach(([pattern, replacement]) => {
        result = result.replace(new RegExp(pattern), replacement);
      });
      return result || '/';
    };
  } else {
    // Default rewrite strips the gateway service prefix from /api/<service> paths,
    // so /api/marketplace/cases becomes /cases for the downstream service.
    rewriteConfig = (path) => path.replace(/^\/api\/[^/]+/, '') || '/';
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: rewriteConfig,
    proxyTimeout: 30000,
    on: {
      error: (err, req, res) => {
        logger.error(`Proxy error → ${target}: ${err.message}`);
        if (res && !res.headersSent) {
          res.status(502).json({
            success: false,
            message: 'Service temporarily unavailable.',
          });
        }
      },
      proxyReq: (proxyReq, req) => {
        if (req.user) {
          proxyReq.setHeader('x-user-id', String(req.user.id || ''));
          proxyReq.setHeader('x-user-email', req.user.email || '');
          proxyReq.setHeader('x-user-role', req.user.role || '');
          proxyReq.setHeader('x-user-username', req.user.username || '');
        }
        logger.info(`Proxy → ${target}${proxyReq.path}`);
      },
    },
  });
};

module.exports = { buildProxy };
