import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"10kb"}));
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//global Error handle
app.use((err,req,res,next)=>{
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