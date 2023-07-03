const express = require("express")
const { BlogModel } = require("../module/blog.model")
const { authorize } = require("../middleware/authorised")

const blogRouter = express.Router()

blogRouter.post("/creat",authorize(["user"]),async(req,res)=>{
    try{
        const data = req.body
        const newBlog = new BlogModel({...data,userID:req.userID})
        await newBlog.save()
        res.status(200).send({msg:"Blog Created"})
    }catch(err){
        res.status(400).send({msg:err.message});
    }
})

blogRouter.get("/myblogs",authorize(["user"]),async(req,res)=>{
     try{
        const {userID} = req.userID;
        const myblogs = await BlogModel.find({userID})
        res.status(200).send(myblogs);
     }catch(err){
        res.status(400).send({msg:err.message});
    }
})

blogRouter.get("/blogs",authorize(["user"]),async(req,res)=>{
    try{
       const blogs = await BlogModel.find()
       res.status(200).send(blogs);
    }catch(err){
       res.status(400).send({msg:err.message});
   }
})

blogRouter.patch("/:id",authorize(["user"]),async(req,res)=>{
    try{
        const {id} = req.params;
        const update = req.body;
        const updated = await BlogModel.findByIdAndUpdate(id,update)
        await updated.save();
        res.status(200).send("blog updated");
    }catch(err){
        res.status(400).send({msg:err.message});
    }
})

blogRouter.delete("/:id",authorize(["user"]),async(req,res)=>{
    try{
        const {id} = req.params;
        const deleted = await BlogModel.findByIdAndDelete(id);
        res.status(200).send("blog deleted");
    }catch(err){
        res.status(400).send({msg:err.message});
    }
})

blogRouter.delete("/:id",authorize(["moderator"]),async(req,res)=>{
    try{
        const {id} = req.params;
        const deleted = await BlogModel.findByIdAndDelete(id);
        res.status(200).send("blog deleted",deleted);
    }catch(err){
        res.status(400).send({msg:err.message});
    }
})




module.exports ={
    blogRouter
}