import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { strict } from "assert";
import { ftruncateSync } from "fs";
import { type } from "os";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
    },
    lastLogin:{
        type:Date
    },
    refreshToken: {
    type: String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,

    },   
    otpExpiry:{
        type:Date,
    },
    lastUsedDevice:{
        type:String, // Hash of IP + User Agent
    }

},{timestamps:true})

userSchema.pre("save",async function () { //pre->hook runs before saving to DB , save->trigger when you call
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
})
userSchema.methods.isPasswordCorrect = async function (password) {  //check correct password
    return await bcrypt.compare(password,this.password)
}

    //jwt.sign(payload, secret, options)

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id, //from database 
            email: this.email,              //*Payload
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,{   //*secret
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY   
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }


    )
}

export const User = mongoose.model("User",userSchema)