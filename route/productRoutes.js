import express from "express";
import { Addproduct } from "../controller/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/add", upload.single("product_image"), Addproduct);

export default router;