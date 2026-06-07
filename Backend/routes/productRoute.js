const express=require("express");
const {protect}=require("../middlewares/authWare");
const {admin}=require("../middlewares/adminMidalware");

const routes=express.Router();


const multer=require("multer");
const upload=multer({dest:"uploads/"});

const{getProducts,getProductById,createProduct,updateProduct,deleteProduct}=require("../controllers/productController");


routes.route("/").get(getProducts).post(protect,admin,upload.single("image"),createProduct);
routes.route("/:id").get(getProductById).put(protect,admin,upload.single("image"),updateProduct).delete(protect,admin,deleteProduct);


module.exports=routes;