import mongoose from "mongoose"
const connectdb=async ()=>{
    try{
       const conn= await mongoose.connect(process.env.MONGO_URL)
       console.log("Mongodb connected "+conn.connection.host)

    }catch(e){
        console.error('Error connecting to MongoDB:', e)
    
    }

    }
export default connectdb;