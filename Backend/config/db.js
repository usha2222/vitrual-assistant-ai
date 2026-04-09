import mongoose from "mongoose"
const connectdb=async ()=>{

    try{
        // const conn1=await mongoose.connect(process.env.MONGO_URI)
       const conn=await mongoose.connect(process.env.LOCAL_URL)
        
        console.log(`MongoDB connected: ` + conn.connection.host)

    }catch(e){
        console.error('Error connecting to MongoDB:', e)
    }

    }
export default connectdb;