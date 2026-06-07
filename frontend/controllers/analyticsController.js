const order=require("../models/order");
const product=require("../models/product");
const user=require("../models/user");

exports.getAdminStats=async(req,res)=>{
    try{
        const totalUser=await user.countDocuments({role:"user"});
        const totalOrders=await order.countDocuments();
        const totalproduct=await product.countDocuments();

        const orders=await order.find(); 

        const totalRevenue=orders.reduce((acc,order)=>acc+order.totalAmount,0);
        res.json({totalUser,totalOrders,totalproduct,totalRevenue});

    }catch(error){
        res.status(500).json({message:"Server error"});
    }

};