import express from 'express';
import { askToAssistant, getCurrentUser, updateAssistant } from '../controllers/user.controller.js';
import  upload  from '../middlewares/multer.js';
import isAuth from '../middlewares/isAuth.js';
const authRouter = express.Router();
authRouter.get('/current',isAuth,getCurrentUser);
authRouter.post('/update-assistant',isAuth,upload.single('assistantImage'),updateAssistant);    
authRouter.post('/asktoassistant',isAuth,askToAssistant);
export default authRouter;
