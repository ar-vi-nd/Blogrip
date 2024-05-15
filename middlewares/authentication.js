const { verifyjwt } = require("../services/authentication")

const fetchuser = (req,res,next)=>{
    // console.log(req.cookies)
    if(!req.cookies?.token){
       next()
    }
    else{
        const user = verifyjwt(req.cookies.token)
        if(!user){
            next()
        }
        else{
            req.user = user
            next()
        }
    }
}

module.exports = {fetchuser}

