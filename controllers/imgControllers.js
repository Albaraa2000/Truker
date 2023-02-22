const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({

  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
