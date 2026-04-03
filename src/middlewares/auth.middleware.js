import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try{
        //* Get token from cookies or Auth Header 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");
        if(!token){
            throw new ApiError(401,"Unauthorized Request")
        }
        //* Decode the token 
        const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        
        //* Find User in DB 
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401,"Invalid Access Token");
        }

        //* Attach user to the request
        req.user = user; 
        next();
    }
    catch(error){
        throw new ApiError(401,error?.message||"Invalid access token");
    }
        
    
});