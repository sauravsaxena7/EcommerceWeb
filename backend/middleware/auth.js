const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");


const jwt = require("jsonwebtoken");
const User = require("../modals/userModal");

exports.isAuthenticatorUser = catchAsyncErrors(async(req,res,next)=>{


    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to access the resourcess"),401);

    }


    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    
    req.user = await User.findById(decodedData.id);


    next();
});

exports.authorizeRoles=(...roles)=>{

    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){


           return next( new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resources`,403));



        }

        next();
    };

};