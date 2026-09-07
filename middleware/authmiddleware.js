import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import userModel from "../model/registration.js";

const middle = dotenv.config()

export default function verification(req, res, next){
    let token = req.cookies.token

    if(!token){ 
        res.status(401).json("user not authenticated");
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = userModel.findById(decoded.id)
    
    if(!req.user){
        res.status(404).json("user not found")
    }
    next();
}