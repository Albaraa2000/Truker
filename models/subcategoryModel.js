const { Schema, model, Types } = require("mongoose");
const schema = Schema(
  {
    name: {
      type: String,
      required: [true, "subcategory name required"],
      trim: true,
      unique: [true, "subcategory name unique"],
      minlength: [2, "too short subcategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
    },
    image: String
  },
  { timestamps: true }
);
module.exports = model("subcategory", schema);
