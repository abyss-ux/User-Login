import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Route
//Anyone can access these(signups and login)
router.route("/register").post(registerUser);
router.route("login").post(loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT,logoutUser);

export default router;  // can rename it in other file due to default export