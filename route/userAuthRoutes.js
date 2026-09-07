import express from "express";
import { register, login } from "../controller/user.js";
import getTotalData from "../controller/paginationController.js";

const router = express.Router();

router.post('/register',register);
router.post('/login', login)
router.get("/pagination", getTotalData);

export default router;