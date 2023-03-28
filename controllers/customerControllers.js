const User = require("../models/customerModel");
const User_license = require("../models/User_license");
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const AppError = require(`${__dirname}/../utils/appError.js`);
const cloudinary = require("./cloudinary");
const vision = require("@google-cloud/vision");

const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
function convert(plain) {
  let indians = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let converted = [];

  for (i = 0; i < plain.length; i++) {
    if (plain[i] == "-") {
      converted.push("-");
    } else {
      for (j = 0; j < 10; j++) {
        if (
          plain[i].charCodeAt(0) == indians[j].charCodeAt(0) ||
          plain[i].charCodeAt(0) - 144 == indians[j].charCodeAt(0)
        ) {
          converted.push(j);
        }
      }
    }
  }
  const conv = converted.join("");
  let dateParts = conv.split("-"); // split the date string into day, month, and year parts
  let year = dateParts[2];
  let month = dateParts[1];
  let day = dateParts[0];

  let outputDate = year + "-" + month + "-" + day; // concatenate year, month, and day parts into YYYY-MM-DD format

  return outputDate; // output the converted date in YYYY-MM-DD format
}
exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) return next(new AppError(`there is no users`, 404));
  res.status(200).json({
    users,
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(`this route is not for password update !!!`, 404));
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filterBody = filterObj(
    req.body,
    "name",
    "email",
    "phone",
    "avatar",
    "active"
  );
  let result;

  if (!req.user.avatar || req.file) {
    result = await cloudinary.uploader.upload(req.file.path, {
      tags: "equipments",
      folder: "users/",
    });
    filterBody.avatar = result.secure_url;
  } else {
    filterBody.avatar = req.user.avatar;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    updatedUser,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id);
  res.status(204).json({
    status: "done",
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new AppError(`there is no user with id ${req.params.id}`, 404));
  res.status(200).json({
    user,
  });
});
const client = new vision.ImageAnnotatorClient({
  keyFilename: "./keyfile.json",
});
exports.getLicense = catchAsync(async (req, res, next) => {
  const results = await cloudinary.uploader.upload(req.file.path, {
    tags: "liscences",
    folder: "liscences/",
  });
  imagePath = results.secure_url;
  const [result] = await client.textDetection(imagePath);
  const ocrResult = result.textAnnotations[0].description;

  const ocrResultArray = ocrResult.split("\n");
  console.log(ocrResultArray);
  const user = new User_license();
  for (let i = 0; i < ocrResultArray.length; i++) {
    if (ocrResultArray[i].startsWith("ادارة")) {
      user.traffic_Department = ocrResultArray[i];
    } else if (ocrResultArray[i].startsWith("رخصه")) {
      user.license_Type = ocrResultArray[i];
    } else if (ocrResultArray[i].startsWith("تاريخ")) {
      converted_Date = convert(ocrResultArray[i].slice(-10));

      user.release_Date = new Date(converted_Date);
    } else if (ocrResultArray[i].includes("الترخيص")) {
      console.log(ocrResultArray[i]);
      convertedd_Date = convert(ocrResultArray[i].slice(-10));
      console.log(convertedd_Date);
      user.license_End = new Date(convertedd_Date);
    } else if (ocrResultArray[i].startsWith("وحدة")) {
      user.traffic_Unit = ocrResultArray[i];
    } else if (ocrResultArray[i].startsWith("2")) {
      user.license_Number = ocrResultArray[i];
    }
  }
  user.userId = req.user._id;
  await user.save();

  res.status(200).json({ status: "success", ocrResult });
});
