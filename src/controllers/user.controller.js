import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { sendMail } from "../utils/mail.js"
import { registerUser } from "./expandController/Register.js"
import { loginUser } from "./expandController/Login.js"
import { logoutUser } from "./expandController/Logout.js"
import { verifyLoginOTP } from "./expandController/Verify.js"

    //const currentDevice = req.headers["user-agent"];

  

     
   

    

    export {registerUser}
    export {loginUser}
    export {logoutUser}
    export {verifyLoginOTP}
