// import mongoose from "mongoose";


// const productSchema = new mongoose.Schema({
//    product_name: {
//      type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   category: String,
//   description: String,
//   actual_price: Number,
//   discounted_price: Number,
// product_image: {
//   type: String,
//   required: true
// }});

// const productModel = mongoose.model("productData", productSchema);

// export default productModel

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    actual_price: {
      type: Number,
      required: true
    },

    discounted_price: {
      type: Number
    },

    product_image: {
      type: String,
      required: true
    },

    attributes: {
      brand: String,
      model: String,
      ram: String,
      processor: String,
      screen_size: String,
      resolution: String,
      display_type: String,
      operating_system: String
    },

    variants: [
      {
        sku: {
          type: String,
          required: true
        },
        color: String,
        storage: String,
        size: String,
        price: Number,
        stock: {
          type: Number,
          default: 0
        },
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ "variants.color": 1 });
productSchema.index({ "variants.storage": 1 });
productSchema.index({ "variants.size": 1 });

const productModel = mongoose.model(
  "Product",
  productSchema
);

export default productModel;