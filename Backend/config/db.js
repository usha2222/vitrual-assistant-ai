import mongoose from "mongoose"
import dns from 'dns';
dns.setServers(['8.8.8.8']);
const connectdb=async ()=>{
    try{
       const conn = await mongoose.connect(process.env.MONGO_URL);
       console.log(`MongoDB Connected: ${conn.connection.host}`);

    }catch(e){
        console.error(`Error connecting to MongoDB: ${e}`);
        process.exit(1);
    }

    }
export default connectdb;