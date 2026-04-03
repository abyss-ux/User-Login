import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // 1. Extract Token
    const token = req.cookies?.accessToken || 
                  req.header("Authorization")?.replace("Bearer ", ""); // Added space after Bearer

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    // 2. Verify Token
    // If jwt.verify fails, it throws an error. 
    // asyncHandler will catch it and send it to your global error handler.
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find User
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid Access Token");
    }

    // 4. Attach to Request
    req.user = user;
    next(); 
});