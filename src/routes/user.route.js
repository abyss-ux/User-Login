import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    verifyLoginOTP
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter,otpLimiter } from "../middlewares/rateLimiter.middleware.js";


const router = Router();

// Public Route
//Anyone can access these(signups and login)
router.route("/register").post(authLimiter,registerUser);
router.route("/login").post(authLimiter,loginUser)
router.route("/verify-otp").post(otpLimiter,verifyLoginOTP)    

// Secured Routes
router.route("/logout").post(verifyJWT,logoutUser);

export default router;  // can rename it in other file due to default export