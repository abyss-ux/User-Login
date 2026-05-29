import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { sendEmail } from "../utils/mail.js"
//const currentDevice = req.headers["user-agent"];

const loginUser = asyncHandler(async(req,res,next)=>{
        //* get data from req.body (email and password)
        const {email , password } = req.body;


        //*check if user exist
        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(404,"User not found!")
        }

        //*Validate Password
        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid) {
            throw new ApiError(401,"Invalid User Credentials")
        }

        //* check current device 
        const currentDevice = req.headers["user-agent"];
        const isNewDevice = user.lastUsedDevice !== currentDevice;

        //Adaptive Check 
        if(isNewDevice){
            //Generate 6 digit OTP
            const  otp = Math.floor(100000+Math.random()*900000).toString();
            //Save Otp to DB on a 10 min expiry window
            user.otp = otp;
            user.otpExpiry = Date.now()+10*60*1000;
            await user.save({validateBeforeSave:false});
            //*Send Email 
            await sendEmail ({
                email: user.email,
                subject : "New Device login Detected",
                message : `We noticed a login from a new browser. Use the code below to verify it's you:`,
                otp : otp

            });
            return res.status(200).json(
                new ApiResponse(200,{otpRequired:true},"OTP sent to your email for new device verification")
            );
        }

        //Standard Login 
        //* Generate access and refresh token 
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        //* save refresh token to DB 
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        //* set option for cookies
        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production"
        };

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); // Sanitize the user
        //*else this sends users hash password and refresh token to the frontend


        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {user: loggedInUser,accessToken,refreshToken},
                "User Logged in successfully"

            )
        );
        
    });

    export {loginUser}
