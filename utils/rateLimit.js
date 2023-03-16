const rateLimit = require('express-rate-limit');
exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes',
  handler: function (req, res) {
    res.status(429).json({
      status: 'failed',
      message: 'Too many requests from this IP, please try again in 15 minutes',
    });
  },
});
