import express from "express";

import {
  addCategory,
  getCategories,
  getCategoryById,
} from "../controller/categoryController.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// Create category
router.post(
  "/",
  upload.single("image"),
  addCategory
);


// Get all categories
router.get(
  "/",
  getCategories
);


// Get category by ID
router.get(
  "/:id",
  getCategoryById
);

export default router;