const express=require("express");
const dotenv=require("dotenv");
dotenv.config();
const app=express();
app.use(express.json());

PORT=process.env.PORT || 5000;

const cors=require("cors");
app.use(cors(
    {
        origin:['http://localhost:3000','http://127.0.0.1:3000'],
        credentials:true
    }
));

const connectDb=require("./config/db");
connectDb();
const Root=require("./routes/authRoutes");
const productRoutes=require("./routes/productRoute");
app.use("/api/auth",Root);
app.use("/api/products",productRoutes);
app.use("/api/orders",require("./routes/orderRoutes"));
app.use("api/payments",require("./routes/paymentRoute"));
app.use("/api/analytics",require("./routes/analyticsRoute"));

app.get("/",(req,res)=>{
    res.send("Working url");
});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
