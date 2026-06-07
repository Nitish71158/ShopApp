const prod=require("../models/product");
const cloudinary=require("../config/cloudinary");
exports.getProducts=async(req,res)=>{
    try{
        const products=await prod.find();
        res.json(products);

    }catch(error){
        res.status(500).json({message:"Server error"});
    }
    
};

exports.createProduct=async(req,res)=>{
    try{
    const{name,description,price,category}=req.body;
    let imgUrl="";
    if(req.file){
        const result=await cloudinary.uploader.upload(req.file.path);
        imgUrl=result.secure_url;
        console.log(result);
    }
    const product=await prod.create({name,description,price,category,imageUrl:imgUrl});
    res.status(201).json(product);
}catch(error){
    res.status(500).json({message:"Server error"});
}
};


exports.getProductById=async(req,res)=>{
    try{
        const product=await prod.findById(req.params.id);
        res.json(product);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};

exports.updateProduct=async(req,res)=>{
    try{
        const{name,description,price,category}=req.body;
        let imgUrl="";
        if(req.file){
            const result=await cloudinary.uploader.upload(req.file.path);
            imgUrl=result.secure_url;
        }
        const product=await prod.findByIdAndUpdate(req.params.id,{name,description,price,category,imageUrl:imgUrl},{new:true});
        res.json(product);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};

exports.deleteProduct=async(req,res)=>{
    try{
        const product=await prod.findById(req.params.id);
        if(product){
            await prod.findByIdAndDelete(req.params.id);
            res.json({message:"Product deleted"});
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};