const order=require("../models/order");
const sendEmail=require("../utils/sendmail");

//createOrder,getOrders,myOrders,orderStatus  

exports.createOrder=async(req,res)=>{
    try{
        const {totalAmount,address,paymentId}=req.body;
        const requestedItems=req.body.item || req.body.items || [];
        const item=Array.isArray(requestedItems) ? requestedItems.map((cartItem)=>({
            productId:cartItem.productId,
            quantity:cartItem.quantity || cartItem.qty || 1,
            price:cartItem.price
        })) : [];
        if(!item || item.length===0 || !totalAmount || !address || !paymentId){
            return res.status(400).json({message:"All fields are required"});
        }

        const orderData = await order.create({user: req.user._id, item, totalAmount, address, paymentId});

        // send confirmation and respond
        await sendEmail(req.user ? req.user.email : "", "Order Confirmation", `Your order with id ${orderData._id} has been placed successfully.`);
        return res.status(201).json(orderData);
    }catch(error){ 
        console.error(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
}; 

exports.myOrders=async(req,res)=>{
    try{
        const orders=await order.find({user:req.user._id}).populate("item.productId","name price");
        res.json(orders);
    }catch(error){
        res.status(500).json({message:"Server error", error: error.message

        });
    }
}; 


exports.getOrders=async(req,res)=>{
    try{
        const orders=await order.find().populate("user","name email");
        res.json(orders);
    }catch(error){
        res.status(500).json({message:error});
    }   
};


exports.orderStatus=async(req,res)=>{
    try{
        const {status}=req.body;
        if(!status || !["pending","shipped","delivered"].includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }
        const orderData=await order.findByIdAndUpdate(req.params.id,{status},{new:true}).populate("user","email");
        if(orderData){
            await sendEmail(orderData.user.email,"Order Status Update",`Your order with id ${orderData._id} is now ${status}.`);
            res.json(orderData);
        }
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};
