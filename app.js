const express = require("express");
const morgan = require("morgan");

const errControllers = require("./controllers/errControllers");


const AppError = require("./utils/appError");
const limiter = require("./utils/rateLimit");
const apiKeyMiddleware = require("./utils/apiKeyMiddleware");


const customerRouter = require("./routes/customerRoutes");
// const equipmentsRouter = require("./routes/equipmentsRoutes");
const brandRouter = require("./routes/brandRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const couponRouter = require("./routes/couponRoutes");
const favoriteListRouter = require("./routes/favoriteListRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const subcategoryRouter = require("./routes/subcategoryRoutes");
const truckRouter = require("./routes/truckRoutes");


const helmet = require("helmet");
const mongo_sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();
app.use(helmet());
app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(express.json());
app.use(mongo_sanitize());
app.use(xss());
app.use(hpp());

app.use(express.static(`${__dirname}/public`));
// app.use(limiter.limiter);
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "https://gradreact.pildextech.cf");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// app.use(apiKeyMiddleware);
app.use("/api/v1/users", customerRouter);
// app.use("/api/v1/Equipments", equipmentsRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/favoriteList", favoriteListRouter);
app.use("/api/v1/truck", truckRouter);
app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Home' });
});

// handle unhandled routes
//firts goes to app error
app.all("*", (req, res, next) => {
  next(new AppError(`can't found ${req.originalUrl}`, 404)); // class inheritance
});

//then errControllers
app.use(errControllers);

module.exports = app;
