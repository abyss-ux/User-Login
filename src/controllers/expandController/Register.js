import {ApiError} from "../../utils/ApiError.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"
import {User} from "../../models/user.models.js"
import {sendMail} from "../../utils/mail.js"
import jwt from "jsonwebtoken"

//const currentDevice = req.headers["user-agent"];

  const registerUser = asyncHandler(async(req,res,next)=>{

    const {username, email, password} = req.body; // Get user data from frontend(req.body)

    if([username,email,password].some((field)=> field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    //* Check for existing User
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    });
    if(existedUser){
        throw new ApiError(409,"User with email or username already existed")
    }

    const signupOtp = Math.floor(100000 + Math.random() * 900000).toString(); //generate OTP
    // const currentDevice = req.headers["user-agent"];
    

    //* create user object -> save/create entry in DB
    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password,
        isVerified:false,
        otp:signupOtp,
        otpExpiry:Date.now()+10*60*1000
    });

    //*Dispatch verification email
    await sendMail({
        email:user.email,
        subject:"Verify Your Account",
        message:`Thank you for registering! Please use the code below to complete your sign-up:` ,
        otp:signupOtp
    })

    return res.status(201).json(
        new ApiResponse(201,{otpRequired:true,email:user.email},"Registration initiated. OTP sent to your email.")

    );
});
    

    //* remove password and refresh token from response for security 
  /*  const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    //* Send success response 
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
    );

});     


// const registerUser = asyncHandler(async (req, res) => {
//     const { username, email, password } = req.body;

//     // Logic: If validation fails, just THROW. 
//     // The asyncHandler catches it and sends it to your Global Error Handler in app.js
//     if (!username) {
//         throw new ApiError(400, "Username is required");
//     }

//     return res.status(201).json({
//         success: true,
//         data: { username, email },
//         message: "User registered successfully",
//     });
// });
*/
    export {registerUser}
