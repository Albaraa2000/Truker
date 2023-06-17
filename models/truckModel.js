const { Schema, model, Types } = require("mongoose");
const schema = Schema(
  {
    name: {
      type: String,
      required: [true, "truck name required"],
      trim: true,
      unique: [true, "truck name unique"],
      minlength: [2, "too short truck name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "truck description required"],
      trim: true,
      minlength: [10, "too short truck description"],
    },
    imageCover: String,
    images: [String],
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: [true, "truck category required"],
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "subcategory",
      required: [true, "truck subcategory required"],
    },
    brand: {
      type: Types.ObjectId,
      ref: "brand",
      required: [true, "truck brand required"],
    },
    currentLocation:{
      type:String,
      default:null,
      required: [true, "current location required"],
    },
    // ratingAverage: {
    //   type: Number,
    //   min: [1, "ratingAverage must be greater than 1"],
    //   min: [5, "ratingAverage must be less than 5"],
    // },
    // ratingCount: {
    //   type: Number,
    //   default: 0,
    // },
    userId: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "truck",
});
schema.pre("findOne", function () {
  this.populate("reviews", "name");
});

module.exports = model("truck", schema);
