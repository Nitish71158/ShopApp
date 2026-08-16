const express=require("express");
const dotenv=require("dotenv");
const path=require("path");
const fs=require("fs");
dotenv.config();
const app=express();
app.use(express.json());

const PORT=process.env.PORT || 3000;

const cors=require("cors");
const envOrigins=(process.env.CORS_ORIGIN || process.env.FRONTEND_URL || process.env.CLIENT_URL || "")
    .split(",")
    .map((origin)=>origin.trim())
    .filter(Boolean);
const allowedOrigins=[
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...envOrigins
];

app.use(cors({
    origin(origin,callback){
        if(!origin || allowedOrigins.includes(origin)){
            return callback(null,true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials:true
}));

const connectDb=require("./config/db");

const ensureDb=async(req,res,next)=>{
    try{
        await connectDb();
        next();
    }catch(error){
        res.status(500).json({
            message:"Database connection failed",
            error:error.message
        });
    }
};

const Root=require("./routes/authRoutes");
const productRoutes=require("./routes/productRoute");
const paymentRoutes=require("./routes/paymentRoute");
app.get("/api/health",(req,res)=>{
    res.json({
        status:"ok",
        hasMongoUri:Boolean(process.env.MONGO_URI)
    });
});
app.use("/api/auth",ensureDb,Root);
app.use("/api/products",ensureDb,productRoutes);
app.use("/api/orders",ensureDb,require("./routes/orderRoutes"));
app.use("/api/payment",paymentRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/analytics",ensureDb,require("./routes/analyticsRoute"));
app.use("/api",(req,res)=>{
    res.status(404).json({message:"API route not found"});
});

const clientBuildPath=path.join(__dirname,"..","frontend","build");

if(fs.existsSync(clientBuildPath)){
    app.use(express.static(clientBuildPath));
    app.get(/.*/,(req,res)=>{
        res.sendFile(path.join(clientBuildPath,"index.html"));
    });
}else{
    app.get("/",(req,res)=>{
        res.send("Working url");
    });
}

if(require.main===module){
    app.listen(PORT,()=>{
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}

module.exports=app;
