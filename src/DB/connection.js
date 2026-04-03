import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try{
        // Option A: The String Fix (Remove the manual slash)
        // const connectionInstance = await mongoose.connect(`${process.env.mongoDB_URL}${DB_NAME}`)
        const connectionInstance = await mongoose.connect(process.env.mongoDB_URL,{
            dbname:DB_NAME,
        });
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
        }
    catch(error){
        console.log("MongoDB connection failed")
        process.exit(1);
    }
}
export default connectDB;