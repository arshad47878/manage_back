import express from "express";

import {
  addSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory
} from "../controller/subcategoryController.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// Create subcategory
router.post(
  "/",
  upload.single("image"),
  addSubcategory
);


// Get all subcategories
router.get(
  "/",
  getSubcategories
);


// Get subcategories by category
router.get(
  "/category/:categoryId",
  getSubcategoriesByCategory
);


// Get subcategory by ID
router.get(
  "/:id",
  getSubcategoryById
);


// Update subcategory
router.put(
  "/:id",
  upload.single("image"),
  updateSubcategory
);


// Delete subcategory
router.delete(
  "/:id",
  deleteSubcategory
);


export default router;