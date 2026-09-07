import express from "express";
import { register, login, updateData, deleteData, getData } from "../controller/user.js";
import getTotalData from "../controller/paginationController.js";
import verification from "../middleware/authmiddleware.js";

const router = express.Router();

router.post('/register',register);
router.post('/login', login)
router.get("/pagination", getTotalData);
router.put("/:id",verification, updateData)
router.delete("/:id",deleteData)
router.get("/", getData)

export default router;