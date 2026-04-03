import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"10kb"}));
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

 //Declaration
   app.use("/api/v1/users",userRouter)

//global Error handle
app.use((err,req,res,next)=>{
    console.log;
    const statusCode = err.statusCode||500;
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success : false,
        statusCode,
        message,
        errors : err.error || [],
        stack : process.env.NODE_ENV === "development"? err.stack : undefined 
    })

})

   

export {app}