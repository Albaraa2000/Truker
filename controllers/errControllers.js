const AppError = require('./../utils/appError');
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field ${err.keyValue.name}, please use another`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>  new AppError("invalid token. Please log in again!", 401);
const  handleExpiredJWT = () =>  new AppError("Expired token. Please log in again!", 401);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorprod = (err, res) => {
  //Operational , trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //programming or other unknown errors
  else {
    //log error
    console.error('Err: ', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};
//main error handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(err);
    let error = { ...err };
    // Handling Invalid Database IDs =====> happens when name === 'CastError'
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // Handling Duplicate Fields =====> happens when code === 11000
    if (error.code == 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

      if (error.name === 'JsonWebTokenError') {
        error = handleJWTError();
      }
      if (error.name === 'TokenExpiredError') {
        error = handleExpiredJWT();
      }
      
    sendErrorprod(error, res);
  }
};
