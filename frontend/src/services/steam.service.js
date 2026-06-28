// Steam OpenID — redirects user to backend which handles OpenID flow
export const steamService = {
  // Returns the backend URL that starts the Steam OpenID redirect chain
  getLoginUrl: () => '/api/auth/steam',
};

export default steamService;
