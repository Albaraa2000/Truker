const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  companyId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  truckId: { type: mongoose.Types.ObjectId, required: true },

  price: { type: String, required: true },
  description:{ type: String, required: true },
  startLocation: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Default coordinates (longitude, latitude)
    },
  },
  deliveryLocation: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Default coordinates (longitude, latitude)
    },
  },
});
const booking = new mongoose.model("booking", bookingSchema);
module.exports = booking;
