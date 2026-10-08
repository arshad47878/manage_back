import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subcategorySchema.index(
  { category: 1, name: 1 },
  { unique: true }
);

subcategorySchema.index(
  { category: 1, slug: 1 },
  { unique: true }
);

const subcategoryModel = mongoose.model(
  "Subcategory",
  subcategorySchema
);

export default subcategoryModel;