import User from '../models/usermodel.js'
import uploadToCloudinary from '../middlewares/cloudinary.js';
export const getCurrentUser=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId).select("-password");
        if(!user){

            return res.status(400).json({success:false,message:"User not found"})
        }
        console.log(user);
        return res.status(200).json({success:true,user})

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}
export const updateAssistant=async(req,res)=>{
    try{
        const {assistantName,imageUrl}=req.body;
        let assistantImage;
        if(req.file){
            assistantImage=await uploadToCloudinary(req.file.path);
        }
        else{
            assistantImage=imageUrl;
        }
            const user=await User.findByIdAndUpdate(req.userId,{assistantName,assistantImage},{new:true}).select("-password");
            if(!user){
                return res.status(400).json({success:false,message:"User not found"})
            }
            return res.status(200).json({success:true,message:"Assistant updated successfully" ,user})

    } catch (error) {
        console.error("Update Assistant Error:", error);
        return res.status(500).json({ success: false, message: "Update Assistant Error", error: error.message });

    }
}

export default {getCurrentUser,updateAssistant}