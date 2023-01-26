const User= require('./../models/userModel');
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);

exports.getAllusers =  catchAsync( async(req, res,next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'succes',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'succes',
    message: 'not Yet Implemented',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'succes',
    message: 'not Yet Implemented',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'succes',
    message: 'not Yet Implemented',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'succes',
    message: 'not Yet Implemented',
  });
};
