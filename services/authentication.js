const jwt = require('jsonwebtoken')

// I am able to access this process.env file anywhere in this project
const JWT_secret = process.env.JWT_secret

const createjwt = (user)=>{
const payload = {_id:user.id,email:user.email,name:user.name,profilepic:user.profilepic}
const authtoken = jwt.sign(payload,JWT_secret)
return authtoken

}

const verifyjwt = (token)=>{
        const user = jwt.verify(token,JWT_secret)
        if(!user){
            return false}
        else{
            return user
        }
    }


module.exports = {createjwt,verifyjwt}