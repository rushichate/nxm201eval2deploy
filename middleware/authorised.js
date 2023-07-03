const authorize = (permittedRole)=>{
    return (req,res,next)=>{
        if(permittedRole.includes(req.role)){
            next()
        }else{
            res.send("not autorised");
        }
    }
}

module.exports={
    authorize
}