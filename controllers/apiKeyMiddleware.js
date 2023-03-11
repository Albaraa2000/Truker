const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey != process.env.API_KEY) {
      res.status(401).json({
        status:"failed",
        message:"please provide API key"
      });
    } else {
      next();
    }
  };
module.exports = apiKeyMiddleware;