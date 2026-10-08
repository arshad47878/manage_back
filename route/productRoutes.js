import express from "express";
import { addProduct } from "../controller/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/add", upload.single("product_image"), addProduct);

export default router;