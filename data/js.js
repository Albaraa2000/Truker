// const cloudinary = require("cloudinary").v2;

// // Configuration
// cloudinary.config({
//   cloud_name: "dax6ipeox",
//   api_key: "375433731538828",
//   api_secret: "dMRK46Tule9E64pTvjqP2yIOgkk",
// });


// const publicId = 'tools/sop5qg7gvlcnchqtwnpv';


// cloudinary.uploader.destroy(publicId, function(error, result) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(result);
//   }
// });
const express = require('express');
const mongoose = require('mongoose');
let app = express();

mongoose
  .connect("mongodb+srv://Belal:EUyTe54i48a8fxpl@cluster0.6hwvkps.mongodb.net/", {
    useNewUrlParser: true,

    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
