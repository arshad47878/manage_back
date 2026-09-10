import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
   product_name: {
     type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: String,
  description: String,
  actual_price: Number,
  discounted_price: Number,
product_image: {
  type: String,
  required: true
}});

const productModel = mongoose.model("productData", productSchema);

export default productModel