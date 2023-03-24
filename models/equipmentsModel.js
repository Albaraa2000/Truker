const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please provide title"],
  },
  category: { 
    type: String, 
    required: [true, "please provide category"],
    enum: ["Aerial Lifts", "Air Compressors","Cabin","Cranes","Dump truck","Earth Moving","Material Handling","Motors"], 
  },
  description: {
    type: String,
    required: [true, "please provide description"],
  },
  photo: {
    type: String,
    required: [true, "please provide photo"],
  },
  // government: {
  //   type: String,
  //   required: [true, "please provide  government"],
  // },
  price: {
    type: Number,
    required: [true, "please provide  price"],
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
    }
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  userId: String,
});

equipmentSchema.index({ location: '2dsphere' });

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
