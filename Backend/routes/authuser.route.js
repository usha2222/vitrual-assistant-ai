import express from 'express';
import { getCurrentUser, updateAssistant } from '../controllers/user.controller.js';
import  upload  from '../middlewares/multer.js';
import isAuth from '../middlewares/isAuth.js';
const authRouter = express.Router();
authRouter.get('/current',isAuth,getCurrentUser);
authRouter.post('/update-assistant',isAuth,upload.single('assistantImage'),updateAssistant);    
export default authRouter;
