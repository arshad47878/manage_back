import categoryModel from "../model/category.js";


// CREATE CATEGORY
export async function addCategory(req, res) {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required"
      });
    }

    // Check duplicate category
    const existingCategory = await categoryModel.findOne({
      $or: [
        { name: name.trim() },
        // { slug: slug.trim() }
      ]
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    // Image Cloudinary se aayegi
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required"
      });
    }

    const category = await categoryModel.create({
      name: name.trim(),
    //   slug: slug.trim(),
      image: req.file.path
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error) {
    console.error("Add Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message
    });
  }
}


// GET ALL CATEGORIES
export async function getCategories(req, res) {
  try {

    const categories = await categoryModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
}


// GET CATEGORY BY ID
export async function getCategoryById(req, res) {
  try {

    const category = await categoryModel.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message
    });
  }
}


// UPDATE CATEGORY
export async function updateCategory(req, res) {
  try {

    const { name, slug } = req.body;

    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    if (name || slug) {

      const duplicateCategory = await categoryModel.findOne({
        $or: [
          ...(name ? [{ name: name.trim() }] : []),
          ...(slug ? [{ slug: slug.trim() }] : [])
        ],
        _id: { $ne: req.params.id }
      });

      if (duplicateCategory) {
        return res.status(409).json({
          success: false,
          message: "Category name or slug already exists"
        });
      }
    }

    if (name) {
      category.name = name.trim();
    }

    if (slug) {
      category.slug = slug.trim();
    }

    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message
    });
  }
}


// DELETE CATEGORY
export async function deleteCategory(req, res) {
  try {

    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Soft delete
    category.isActive = false;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message
    });
  }
}