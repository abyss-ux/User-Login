import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"

    const registerUser = asyncHandler(async(req,res)=>{
    //* Get Data and Validate 

    const {username, email, password} = req.body; // Get user data from frontend(req.body)

    if([username,email,password].some((field)=> field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    //* Check for existing User
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    });
    if(existedUser){
        throw new ApiError(401,"User with email or username already existed")
    }

    //* create user object -> save/create entry in DB
    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password,
    });
    //* remove password and refresh token from response for security 
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    //* Send success response 
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
    );

});

     const loginUser = asyncHandler(async(req,res)=>{
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

        //* Generate access and refresh token 
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        //* save refresh token to DB 
        user.refreshToken = refreshToken;
        await user.save({validateBeforSave : false});

        //* set option for cookies
        const options = {
            httpOnly : true,
            secure : true
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

    const logoutUser = asyncHandler(async(req,res)=>{
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
            secure:true
        }
        
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User Logged out successfully"))

    });
    

    export {registerUser}
    export {loginUser}
    export {logoutUser}
