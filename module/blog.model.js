const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
     title:{type:String,required:true},
     info:{type:String,required:true,unique:true},
     userID:{type:String,required:true}
},{
    versionKey:false
})

const BlogModel = mongoose.model("blog",blogSchema)

module.exports = {
    BlogModel
}