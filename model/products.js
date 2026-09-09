import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  product_name: String,
  category: String,
  description: String,
  actual_price: Number,
  discounted_price: Number
});

const productModel = mongoose.model("productData", productSchema);

export default productModel