const mongoose=require('mongoose');
const dns=require("dns");

const dnsServers=(process.env.DNS_SERVERS || "")
    .split(",")
    .map((server)=>server.trim())
    .filter(Boolean);

if(dnsServers.length){
    dns.setServers(dnsServers);
}

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed",error);
        process.exit(1);
    }  
}

module.exports=connectDb;
