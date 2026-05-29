import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { sendEmail } from "../utils/mail.js"

//const currentDevice = req.headers["user-agent"];


 //Verify Login OTP
    const verifyLoginOTP = asyncHandler(async(req,res,next)=>{
        const {email,otp} = req.body;
        const currentDevice = req.headers["user-agent"];

        const user = await  User.findOne({email});

        //*validate if OTP exists,matches and is within 10 minute expiry window
        if(!user || !user.otp || user.otp!== otp || user.otpExpiry<Date.now()){
            throw new ApiError(400,"Invalid or Expired OTP");
        }

        //clear this OTP tokens and save this browser fingerprint as the new "lastUsedDevice"
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.lastUsedDevice = currentDevice;

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        const options = {
            httpOnly:true,
            secure : process.env.NODE_ENV === "production"

        };

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,accessToken,refreshToken
                },
                "Device verified and user logged in successfully!"
            )
        );

    });

    export {verifyLoginOTP}