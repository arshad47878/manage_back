// import productModel from "../model/products.js";

// function createSlug(name) {
//   return name
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

// export async function Addproduct(req, res) {
//   try {    
//      console.log("BODY:", req.body);
//     console.log("FILE:", req.file);
//     const {
//       product_name,
//       category,
//       description,
//       actual_price,
//       discounted_price,
//     } = req.body;

//     const existingProduct = await productModel.findOne({
//       product_name: product_name.trim()
//     });

//     if (existingProduct) {
//       return res.status(409).json({
//         success: false,
//         message: "Product name already exists"
//       });
//     }

//      const slug = createSlug(product_name);

//     const product = await productModel.create({
//       product_name,
//       slug,
//       category,
//       description,
//       actual_price,
//       discounted_price,
//       product_image: req.file?.path

//     });

//     res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       product
//     });

//   } catch (error) {

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Product name already exists"
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to add product",
//       error: error.message
//     });
//   }
// }

import productModel from "../model/products.js";
import categoryModel from "../model/category.js";
import subcategoryModel from "../model/subcategory.js";

export async function addProduct(req, res) {
  try {
    const {
      product_name,
      category,
      subcategory,
      description,
      actual_price,
      discounted_price,
      attributes,
      variants
    } = req.body;

    // Required fields
    if (
      !product_name ||
      !category ||
      !subcategory ||
      !actual_price
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    // Slug generate
    const slug = product_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check category
    const existingCategory = await categoryModel.findOne({
      _id: category,
      isActive: true
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Check subcategory
    const existingSubcategory =
      await subcategoryModel.findOne({
        _id: subcategory,
        isActive: true
      });

    if (!existingSubcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found"
      });
    }

    // Check category-subcategory relation
    if (
      existingSubcategory.category.toString() !==
      category.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected subcategory does not belong to selected category"
      });
    }

    // Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required"
      });
    }

    // Check duplicate product
    const existingProduct = await productModel.findOne({
      $or: [
        { product_name: product_name.trim() },
        { slug }
      ]
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists"
      });
    }

    // Parse attributes
    let parsedAttributes = {};

    if (attributes) {
      try {
        parsedAttributes =
          typeof attributes === "string"
            ? JSON.parse(attributes)
            : attributes;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid attributes JSON"
        });
      }
    }

    // Parse variants
    let parsedVariants = [];

    if (variants) {
      try {
        parsedVariants =
          typeof variants === "string"
            ? JSON.parse(variants)
            : variants;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid variants JSON"
        });
      }
    }

    // Create product
    const product = await productModel.create({
      product_name: product_name.trim(),
      slug,
      category,
      subcategory,
      description,
      actual_price,
      discounted_price,
      product_image: req.file.path,
      attributes: parsedAttributes,
      variants: parsedVariants
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
}