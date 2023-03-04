const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const errControllers = require("./controllers/errControllers");
const userRouter = require("./routes/userRoutes");
const equipmentsRouter = require("./routes/equipmentsRoutes");
const app = express();

app.use(morgan("dev"));

app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
// app.use((req, res, next) => {ذ
//   req.requestTime = new Date().toISOString();
//   console.log(req.headers);
//   next();
// })

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/Equipments", equipmentsRouter);

// handle unhandled routes
//firts goes to app error
app.all("*", (req, res, next) => {
  next(new AppError(`can't found ${req.originalUrl}`, 404)); // class inheritance
});

//then errControllers
app.use(errControllers);

module.exports = app;
