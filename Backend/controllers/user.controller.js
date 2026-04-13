import User from '../models/usermodel.js'
export const getCurrentUser=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
        return res.status(200).json({success:true,user})

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}
export default {getCurrentUser}