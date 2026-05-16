import express from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';
import isAuth from '../middlewares/isAuth.js';
const userRouter=express.Router();
userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/logout',isAuth,logout);
export default userRouter;
