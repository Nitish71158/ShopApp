const express=require("express");
const router=express.Router();

const {protect}=require("../middlewares/authWare");
const {admin}=require("../middlewares/adminMidalware");

const {getAdminStats}=require("../controllers/analyticsController");

router.route("/").get(protect,admin,getAdminStats);

module.exports=router;