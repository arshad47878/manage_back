import express from "express";
import { Addproduct } from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/addProducts", Addproduct);

export default productRouter;