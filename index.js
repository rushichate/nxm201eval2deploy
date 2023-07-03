const express = require("express")
const cookieParser = require("cookie-parser")
const { connection } = require("./db")
const { userRouter } = require("./routes/user.route")
const { auth } = require("./middleware/auth,js")
const { blogRouter } = require("./routes/blog.route")

require("dotenv").config()


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/users",userRouter)
app.use(auth)
app.use("/blogs",blogRouter)

app.listen(process.env.port,async()=>{ 
    try{
        await connection
        console.log(`Connected to DB`)
    }catch(err){
      console.log("not able to connect",err)
    }
    console.log(`running on port ${process.env.port}`)
})