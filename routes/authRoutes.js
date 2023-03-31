import express from 'express';
const router=express.Router();
import authenticateUser from '../middleware/auth.js';
import {register, login, updateUser} from '../controllers/authController.js';
import rateLimiter from 'express-arte-limit'

const apiLimiter=rateLimiter({
    windows:15*60*1000,
    max:50,
    message:'Too many request from this IP, please try after 15 mins'
})

router.route('/register').post(apiLimiter,register)
router.route('/login').post(apiLimiter,login)
router.route('/updateUser').patch(authenticateUser,updateUser)

export default router;