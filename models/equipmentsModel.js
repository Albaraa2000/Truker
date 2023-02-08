const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true,"please provide description"],
  },
  avatar: {
    type: String,
    required: [true,"please provide avatar"],
  },
  photo: {
    type: String,
    required: [true,"please provide photo"],
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true,"please provide  price"],
  },
  rating: {
    type: Number,
    required: [true,"please provide rating"],
  },
  favourite: {
    type: Boolean,
    default: false,
  },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
