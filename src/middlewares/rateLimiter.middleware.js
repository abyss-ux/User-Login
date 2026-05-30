import rateLimit from "express-rate-limit"; 
import { ApiError } from "../utils/ApiError.js";

export const authLimiter = rateLimit({
    windowMs:15*60*1000, //15 min window
    max:5, // limit each IP to 5 req per window
    standardHeaders:true, //return rate limit info in rate limit info in rate limit header
    legacyHeaders:false,
    handler: (req,res,next)=>{
        throw new ApiError(429,"Too many Requests, Try again after 15 minutes")
    }

})

export const otpLimiter = rateLimit({
    windowMs:5*60*1000,  //5 minute window
    max:3,   // 3 tries
    standardHeaders:true,
    legacyHeaders:false,
    handler:(req,res,next)=>{
        throw new ApiError(429,"Wrong OTP multiple times,Access blocked for 5 minutes")
    }

})
