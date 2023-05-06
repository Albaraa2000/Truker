const { Schema, model, Types } = require("mongoose");
const schema = Schema(
  {
    title: {
      type: String,
      required: [true, "review name required"],
      trim: true,
      minlength: [1, "too short review name"],
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    truck: {
      type: Types.ObjectId,
      ref: "truck",
    },
    ratingAverage: {
      type: Number,
      min: [1, "ratingAverage must be greater than 1"],
      max: [5, "ratingAverage must be less than 5"],
    },
  },
  { timestamps: true }
);
schema.pre(/^find/, function () {
  this.populate("user", "name");
});
module.exports = model("review", schema);
