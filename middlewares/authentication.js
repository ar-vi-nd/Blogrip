const { verifyjwt } = require("../services/authentication")

const fetchuser = (req,res,next)=>{
    // console.log(req.cookies)
    if(!req.cookies?.token){
      return next()
    }
    else{
        const user = verifyjwt(req.cookies.token)
        if(!user){
          return  next()
        }
        else{
            req.user = user
          return  next()
        }
    }
}

module.exports = {fetchuser}

