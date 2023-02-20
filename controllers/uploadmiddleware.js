const multer = require('multer');

// configure the upload destination and file naming convention
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// create the multer middleware with the configured storage
const upload = multer({ storage: storage });

// export the middleware function
module.exports = upload;
