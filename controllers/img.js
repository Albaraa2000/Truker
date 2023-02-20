// const app = require('./../app');
// const path = require("path");
// const multer = require("multer");

// app.set("view engine", "ejs");

// const cloudinary = require('cloudinary').v2;


// // Configuration 
// cloudinary.config({
//   cloud_name: "dnp0llgn2",
//   api_key: "794648356647968",
//   api_secret: "284gqPXRS4Q3gSF5fimyGwML4v0"
// });


// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });

// // Route for handling file uploads
// app.post("/upload", upload.single("image"), function (req, res, next) {
//   // Use Cloudinary SDK to upload the image
//   cloudinary.uploader.upload(req.file.path, function (err, result) {
//     if (err) {
//       console.log(err);
//       return res
//         .status(400)
//         .json({ message: "Error uploading image to Cloudinary" });
//     }

//     // Return the URL of the uploaded image to the client
//     res.status(200).json({ url: result.secure_url });
//   });
// });

