const mongoose=require('mongoose');

const dns=require("dns");

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

let connectionPromise;

const connectDb=async()=>{
    if(mongoose.connection.readyState===1){
        return mongoose.connection;
    }

    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI is not configured");
    }

    if(!connectionPromise){
        connectionPromise=mongoose.connect(process.env.MONGO_URI,{
            serverSelectionTimeoutMS:5000
        })
            .then((mongooseInstance)=>{
                console.log("MongoDB connected successfully");
                return mongooseInstance.connection;
            })
            .catch((error)=>{
                connectionPromise=null;
                console.error("MongoDB connection failed",error);
                throw error;
            });
    }

    return connectionPromise;
}

module.exports=connectDb;
