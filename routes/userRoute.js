import express from 'express';
import {loginUser,registerUser, fetchProfile, updateProfile, changePassword} from '../controllers/userController.js'; 
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();



userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/profile', authMiddleware, fetchProfile)
userRouter.put('/update-profile', authMiddleware, updateProfile)
userRouter.put('/change-password', authMiddleware, changePassword)  

export default userRouter;