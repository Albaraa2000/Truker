const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  service_providerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  customerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  truckId: { type: mongoose.Types.ObjectId, required: true },
  booked: {
    type: Boolean,
    default: false,
    required: true,
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  bookCode: {
    type: String,
  },
  service_providerCode: {
    type: Boolean,
    default: false,
  },
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
  paymentType: {
    type: String,
    enum: ["card", "cash"],
    default: "cash",
  },
  paid: {
    type: Boolean,
    default: false,
  },
  image:String,
});
const booking = new mongoose.model("booking", bookingSchema);
module.exports = booking;
