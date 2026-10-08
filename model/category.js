import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
    //   required: true,
      unique: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const categoryModel = mongoose.model(
  "Category",
  categorySchema
);

export default categoryModel;