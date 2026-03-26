import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { strict } from "assert";

const userSchema = new Schema({
    username:{
        type:String,
        requrired:true,
        unique:true,
        index:true,
        trim:true,
    },
    password:{
        type:String,
        requrired:[true,"Password is required"],
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
    },
},{timestamps:true})
