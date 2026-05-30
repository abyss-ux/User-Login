import {ApiError} from "../../utils/ApiError.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"
import {User} from "../../models/user.models.js"
import {sendMail} from "../../utils/mail.js"
//const currentDevice = req.headers["user-agent"];

const logoutUser = asyncHandler(async(req,res,next)=>{
        //* 1. find user and remove the refresh token from DB 
        //* we get req.user._id from the verify JWT middleware
        await User.findByIdAndUpdate(
            req.user._id,{
                $set:{
                    refreshToken: undefined // Remove the token from DB
                }

            },
            {
                new: true
            }
        );
        //* 2. clear the cookie from browser 
        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"
        }
        
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User Logged out successfully"))

    });
    
    export {logoutUser}
