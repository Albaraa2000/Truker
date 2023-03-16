const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const errControllers = require("./controllers/errControllers");
const apiKeyMiddleware = require("./controllers/apiKeyMiddleware");
const customerRouter = require("./routes/customerRoutes");
const equipmentsRouter = require("./routes/equipmentsRoutes");
const limiter = require("./utils/rateLimit");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
app.use(limiter.limiter);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,On-behalf-of, x-sg-elas-acl"
  );
  next();
});

// app.use(apiKeyMiddleware);
app.use("/api/v1/users", customerRouter);
app.use("/api/v1/Equipments", equipmentsRouter);

// handle unhandled routes
//firts goes to app error
app.all("*", (req, res, next) => {
  next(new AppError(`can't found ${req.originalUrl}`, 404)); // class inheritance
});

//then errControllers
app.use(errControllers);

module.exports = app;
