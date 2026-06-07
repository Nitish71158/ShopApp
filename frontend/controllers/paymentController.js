//createdOrder , verifyPayment

const razorpay=require("razorpay");
const crypto=require("crypto");
const dotenv=require("dotenv").config();

exports.createdOrder=async(req,res)=>{
    try{
        const instance=new razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        });
        const options={
            amount:req.body.amount*100,
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex")
        };
        const order=await instance.orders.create(options);
        res.status(201).json(order);
    }
    catch(error){
        res.status(500).json({message:"Server error",error:error.message});
    }
};

exports.verifyPayment=async(req,res)=>{
    try{
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
        const sign=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+"|"+razorpay_payment_id).digest("hex");
        if(sign===razorpay_signature){
            res.json({message:"Payment verified successfully"});
        }else{
            res.status(400).json({message:"Invalid signature"});
        }
    }catch(error){
        res.status(500).json({message:"Server error",error:error.message});
    }   
};