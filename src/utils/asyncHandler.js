export const asyncHandler = (requestHandler) =>{
    return(req,res,next) =>{
        console.log("checking next in asyncHandler",typeof next);
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}



    //* one of the method to form asyncHandler function using try catch block 

// const asyncHandler = (fn) => async (req,res,next) => {
//         try{
//             await fn(req,res,next)
//         }
//         catch(error){
//             res.status(err.code||500).json({
//                 success:false,
//                 message:err.message 
//             })
//         }
// }