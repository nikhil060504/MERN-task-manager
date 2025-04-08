const rateLimit = require('express-rate-limit');

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true, // optional, helps avoid blocking failed attempts
  keyGenerator: (req) => req.ip || req.connection.remoteAddress || "127.0.0.1", // fallback IP
});

module.exports = authRateLimiter;
