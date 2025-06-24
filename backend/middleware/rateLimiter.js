const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
<<<<<<< HEAD
  max: 100, // Limit each IP to 100 requests per windowMs
=======
  max: 300, // Limit each IP to 100 requests per windowMs
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
  message: "Too many requests from this IP, please try again after 15 minutes",
});

module.exports = limiter;
