const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please provide title"],
  },
  description: {
    type: String,
    required: [true, "please provide description"],
  },
  photo: {
    type: String,
    required: [true, "please provide photo"],
  },
  type: {
    type: String,
    required: [true, "please provide  type"],
  },
  price: {
    type: Number,
    required: [true, "please provide  price"],
  },
  rating: {
    type: Number,
    required: [true, "please provide rating"],
  },
  favourite: {
    type: Boolean,
    default: false,
  },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
