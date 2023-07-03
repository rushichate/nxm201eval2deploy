const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
     name:{type:String,required:true},
     email:{type:String,required:true,unique:true},
     password:{type:String,required:true},
     role:{type:String,default:"user",required:true,enum:["user","moderator"]}
},{
    versionKey:false
})

const UserModel = mongoose.model("user",userSchema)

module.exports = {
    UserModel
}