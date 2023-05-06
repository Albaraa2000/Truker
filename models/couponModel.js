const { Schema, model, Types } = require("mongoose");
const schema = Schema(
  {
    code: {
      type: String,
      required: [true, "coupon code required"],
      trim: true,
      unique: [true, "coupon code unique"],
    },
    expires: {
      type: Date,
    },

    discount: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = model("coupon", schema);
