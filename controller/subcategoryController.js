import subcategoryModel from "../model/subcategory.js";
import categoryModel from "../model/category.js";


// CREATE SUBCATEGORY
export async function addSubcategory(req, res) {
  try {

    const { name, slug, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and category are required"
      });
    }

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

    // Check duplicate subcategory
    const existingSubcategory = await subcategoryModel.findOne({
      $or: [
        { name: name.trim() },
        // { slug: slug.trim() }
      ],
      category
    });

    if (existingSubcategory) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists in this category"
      });
    }

    // Image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Subcategory image is required"
      });
    }

    const subcategory = await subcategoryModel.create({
      name: name.trim(),
    //   slug: slug.trim(),
      category,
      image: req.file.path
    });

    return res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: subcategory
    });

  } catch (error) {
    console.error("Add Subcategory Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subcategory",
      error: error.message
    });
  }
}


// GET ALL SUBCATEGORIES
export async function getSubcategories(req, res) {
  try {

    const subcategories = await subcategoryModel
      .find({ isActive: true })
      .populate("category", "name slug image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories
    });

  } catch (error) {
    console.error("Get Subcategories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories",
      error: error.message
    });
  }
}


// GET SUBCATEGORIES BY CATEGORY
export async function getSubcategoriesByCategory(req, res) {
  try {

    const subcategories = await subcategoryModel
      .find({
        category: req.params.categoryId,
        isActive: true
      })
      .populate("category", "name slug image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories
    });

  } catch (error) {
    console.error("Get Subcategories By Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories",
      error: error.message
    });
  }
}


// GET SUBCATEGORY BY ID
export async function getSubcategoryById(req, res) {
  try {

    const subcategory = await subcategoryModel
      .findOne({
        _id: req.params.id,
        isActive: true
      })
      .populate("category", "name slug image");

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: subcategory
    });

  } catch (error) {
    console.error("Get Subcategory Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subcategory",
      error: error.message
    });
  }
}


// UPDATE SUBCATEGORY
export async function updateSubcategory(req, res) {
  try {

    const { name, slug, category } = req.body;

    const subcategory = await subcategoryModel.findById(
      req.params.id
    );

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found"
      });
    }

    // If category is being changed
    if (category) {

      const existingCategory = await categoryModel.findOne({
        _id: category,
        isActive: true
      });

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "New category not found"
        });
      }

      subcategory.category = category;
    }

    if (name) {
      subcategory.name = name.trim();
    }

    if (slug) {
      subcategory.slug = slug.trim();
    }

    if (req.file) {
      subcategory.image = req.file.path;
    }

    await subcategory.save();

    return res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      data: subcategory
    });

  } catch (error) {
    console.error("Update Subcategory Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update subcategory",
      error: error.message
    });
  }
}


// DELETE SUBCATEGORY
export async function deleteSubcategory(req, res) {
  try {

    const subcategory = await subcategoryModel.findById(
      req.params.id
    );

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found"
      });
    }

    // Soft delete
    subcategory.isActive = false;

    await subcategory.save();

    return res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully"
    });

  } catch (error) {
    console.error("Delete Subcategory Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete subcategory",
      error: error.message
    });
  }
}