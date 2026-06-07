const mongoose=require('mongoose');
const dotenv=require("dotenv");
const connectDb=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed",error);
        process.exit(1);
    }  
}

module.exports=connectDb;