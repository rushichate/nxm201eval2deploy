const express = require("express")
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { UserModel } = require("../module/user.model");
const { BlacklistModel } = require("../module/blacklist.model");
require("dotenv").config()

userRouter.post("/signup",async(req,res)=>{
    try{
        const {email,password} = req.body;
        const isUserPresent = await UserModel.findOne({email})
        if(isUserPresent){
            return res.status(400).sned({msg:"email already exist please login or try another email"})
        }
        const hashedPass = bcrypt.hashSync(password,4);
        const user = new UserModel({...req.body,password:hashedPass});
        await user.save()
        res.status(200).send({msg:"SignUP Successful",useris:user})
       }catch(err){
        res.status(400).send({msg:err.message});
       }
})

userRouter.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
        const isUserPresent = await UserModel.findOne({email})

        if(!isUserPresent){
            return res.status(400).send({msg:"Please SignUp"})
        }

        const isPasswordMatch = bcrypt.compareSync(password,isUserPresent.password);

        if(!isPasswordMatch){
            return res.status(400).send({msg:"Wrong credentials"})
        }

        const accessToken = jwt.sign({userId:isUserPresent._id,role:isUserPresent.role},
            process.env.Access_Token_Secret_Key,
            {expiresIn:process.env.Access_Token_Secret_Key_expire});

        const refreshToken =   jwt.sign({userId:isUserPresent._id,role:isUserPresent.role},
            process.env.Refresh_Token_Secret_Key,
            {expiresIn:process.env.Refresh_Token_Secret_Key_expire});


        res.cookie("Access_token",accessToken,{maxAge:1000*60*5})    
         res.cookie("Refresh_token",refreshToken,{maxAge:1000*60*6})

        res.status(200).send({msg:"Login Success"})
    }catch(err){
        res.status(400).send({msg:err.message});
    }
})

userRouter.get("/logout",async(req,res)=>{
    try{
                const {Access_token,Refresh_token} = req?.cookies
                if(!Access_token || !Refresh_token){
                    res.status(400).send({msg:"Unauthorized"})
                }
                const blacklistAccessToken = new BlacklistModel({token:Access_token})
                const blacklistRefreshYoken = new BlacklistModel({token:Refresh_token})
        
                await blacklistAccessToken.save()
                await blacklistRefreshYoken.save()
        
                res.clearCookie("Access_token")
                res.clearCookie("Refresh_token")
                res.status(200).send({msg:"Logout Successful"})
            }catch(err){
                res.status(400).sned({msg:err.message})
            }
})

userRouter.get("/generatetoken",async(req,res)=>{
    try{
        const Refresh_token = req?.cookies?.Refresh_token
        const isTokenBlacklisted = await BlacklistModel.findOne({token:Refresh_token})
        if(isTokenBlacklisted){
            return res.status(400).send({msg:"Please Login"})
        }

        const isTokenValid = jwt.verify(Refresh_token,process.env.Refresh_Token_Secret_Key)
        if(!isTokenValid){
            return res.status(400).send({msg:"Please Login"})
        }

        const newAccessToken = jwt.sign({userId:isTokenValid._id,role:isTokenValid.role},
            process.env.Access_Token_Secret_Key,{
            expiresIn:process.env.Access_Token_Secret_Key_expire
            })
            res.cookie("Access_token",newAccessToken)
            res.status(200).send({msg:"Token Generated",newAccessToken})
    }catch(err){
        res.status(400).sned({msg:err.message})
    }
})


module.exports = {
    userRouter
}


