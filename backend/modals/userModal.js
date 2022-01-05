const mongoose = require("mongoose");

const validator = require("validator");


const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const userSchema = mongoose.Schema({
   name:{
    type:String,
    required:[true,"Please Enter Your Name"],
    maxLength:[30,"Name Cannot exceed 30 characters"],
    minLength:[4,"Name should more than 4 characters"]
   },


   email:{
    type:String,
    required:[true,"Please Enter Your Email"],
    maxLength:[30,"Name Cannot exceed 30 characters"],
    validate:[validator.isEmail,"Please Enter Valid Email"],

    unique:true
   },

   password:{
       type:String,
       required:[true,"Please Enter Your Password"],
       minLength:[8,"Password must be of 8 characters"],
       select:false
   },

   avatar:{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }

   },

   role:{

    type:String,
    default:"user",

   },

   resetPasswordToken : String,
   reserPasswordExpire:Date




});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){

        next();

    }
    this.password=await bcrypt.hash(this.password,10);
});



// JWT TOKEN

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}

//compare password


userSchema.methods.comparePassword = async function(entereDpassword){
    return await bcrypt.compare(entereDpassword,this.password); 
}


//Generating password

userSchema.methods.getResetPasswordToken = function (){
    //generating token

    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema


    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.reserPasswordExpire = Date.now()+15*60*1000;

    return resetToken;

};




module.exports = mongoose.model("user",userSchema);