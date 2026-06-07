const express=require("express");
const routes=express.Router();
const {protect}=require("../middlewares/authWare");
const {admin}=require("../middlewares/adminMidalware");

const{createOrder,getOrders,myOrders,orderStatus}=require("../controllers/orderController");


routes.route("/").get(protect,admin,getOrders).post(protect,createOrder);
routes.get("/myOrder",protect,myOrders);
routes.route("/:id/status").put(protect,admin,orderStatus); 

module.exports=routes;