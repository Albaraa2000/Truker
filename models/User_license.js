const mongoose = require("mongoose");

const ocrResultSchema = new mongoose.Schema({
  traffic_Department: String,
  license_Type: String,
  traffic_Unit: String,
  arabic_Name: String,
  address: String,
  nationality: String,
  job: String,
  license_Number: String,
  english_name: String,
  english_Nationality: String,
  release_Date: String,
  license_End: String,
  type: String,
});

module.exports = mongoose.model("OCRResult", ocrResultSchema);
