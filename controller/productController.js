import productModel from "../model/products.js";

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function Addproduct(req, res) {
  try {
     console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const {
      product_name,
      category,
      description,
      actual_price,
      discounted_price,
    } = req.body;

    const existingProduct = await productModel.findOne({
      product_name: product_name.trim()
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product name already exists"
      });
    }

     const slug = createSlug(product_name);

    const product = await productModel.create({
      product_name,
      slug,
      category,
      description,
      actual_price,
      discounted_price,
      product_image: req.file?.filename

    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Product name already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
}