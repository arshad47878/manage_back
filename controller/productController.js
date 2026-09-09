import productModel from "../model/products.js";

export async function Addproduct(req, res) {
  try {
    const {
      product_name,
      category,
      description,
      actual_price,
      discounted_price
    } = req.body;

    const product = await productModel.create({
      product_name,
      category,
      description,
      actual_price,
      discounted_price
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
}