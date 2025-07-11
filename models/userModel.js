const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    resetToken:{type:String},
    resetTokenExpireDate:{type:Date}
},{timestamps:true})

module.exports=mongoose.model("users",userSchema);
    