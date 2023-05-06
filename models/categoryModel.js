const { Schema, model } = require("mongoose");
const schema = Schema(
  {
    name: {
      type: String,
      required: [true, "category name required"],
      trim: true,
      unique: [true, "category name unique"],
      minlength: [2, "too short category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
module.exports = model("category", schema);
