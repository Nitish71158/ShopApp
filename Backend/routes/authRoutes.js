const express=require("express");
const routes=express.Router();
const{Register,loginUser,getUser,verifyOTP}=require("../controllers/authController");
const {protect}=require("../middlewares/authWare");
const {admin}=require("../middlewares/adminMidalware");


routes.post("/register",Register);
routes.post("/login",loginUser);
routes.post("/verify",verifyOTP);
routes.get("/user",protect,admin,getUser); 

module.exports=routes;