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
 
 app.get("/",(req,res)=>{
     res.send("Welcome to the SERVER!!")
    })
    
    app.use("/api/v1/users",userRouter)
   
    

//global Error handler
app.use((err,req,res,next)=>{
    console.log("Global Error Handler",err);
    const statusCode = err.statusCode||500;
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success : false,
        statusCode,
        message,
        errors : err.error || "Laude ka error",
        stack : process.env.NODE_ENV === "development"? err.stack : undefined 
    })

})

   

export {app}