import getToken from "../config/token.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try{
const {name,email,password}=req.body;
const existingEmail= await User.findOne({email});
if(existingEmail){
    return res.status(400).json({message:"Email already exists  !"});
}
if(password.length<6){
    return res.status(400).json({message:"Password must be at least 6 characters long !"});
}  
const hashedPassword=await bcrypt.hash(password,10);

const user=await User.create({
    name,
    email,
    password:hashedPassword});
    const token=await getToken(user._id);
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
return res.status(201).json({message:"User registered successfully",user, token});
    }
    catch(e){
        console.error('Error during registration:', e);
        res.status(500).json({message:"Server error" ,error: e.message});
    }
    
}
export const login = async (req, res) => {
    try{
const {email,password}=req.body;
const existingEmail= await User.findOne({email});
if(!existingEmail){
    return res.status(400).json({message:"Email does not exist  !"});
}
const isMatch=await bcrypt.compare(password, existingEmail.password);
if(!isMatch){
    return res.status(400).json({message:"Invalid password!"});
}
const token=await getToken(existingEmail._id);
res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
return res.status(200).json({message:"Login successful", user: existingEmail, token});
    }
    catch(e){
        console.error('Error during login:', e);
        res.status(500).json({message:"Server error" ,error: e.message});
    }
    
}

export const logout = (req, res) => {
    try{
    res.clearCookie('token');
   return  res.status(200).json({message:"Logout successful"});
    }
      catch(e){
        console.error('Error during logout:', e);
        res.status(500).json({message:"Server error" ,error: e.message});
    }
}                               

export  default { login, register, logout }