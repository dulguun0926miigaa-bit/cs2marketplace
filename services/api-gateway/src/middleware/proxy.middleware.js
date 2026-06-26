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
    rewriteConfig = (p) => p.replace(new RegExp(`^${escaped}`), '') || '/';
  } else if (pathRewrite && typeof pathRewrite === 'object') {
    rewriteConfig = pathRewrite;
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
        // Forward user identity headers extracted from JWT
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
