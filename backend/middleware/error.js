const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err,req,res,next)=>{
    err.statuscode = err.statuscode || 500;

    err.message = err.message || "Internal Server Error";



    //wrong MongoDb Id Error

    if(err.name === "CastError"){

        const message = `Resources not found. Invalid: ${err.path}`;

        err = new ErrorHandler(message,400);

    }


    //Mongoose duplicate key error

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    //Wrong Jwt Error

    if(err.name === "JsonWebTokenError"){
        const message = "Json Web Token Error or Invalid token please try again"
        ;
        err = new ErrorHandler(message,400);
    }

    //JWT EXPIRE ERROR

    if(err.name === "TokenExpiredError"){
        const message = "Json Web Token is Expired, Try again";
        ;
        err = new ErrorHandler(message,400);
    }




    res.status(err.statuscode).json({
        success:false,
         error:err.stack
        // error:err.message
    });
};