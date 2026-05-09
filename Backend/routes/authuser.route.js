import express from 'express';
import { askToAssistant, deleteHistory, getCurrentUser } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';
const authRouter = express.Router();
authRouter.get('/current',isAuth,getCurrentUser);
authRouter.post('/asktoassistant',isAuth,askToAssistant);
authRouter.post('/delete-history',isAuth,deleteHistory);
export default authRouter;
