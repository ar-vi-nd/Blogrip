const jwt = require('jsonwebtoken')
const JWT_secret = "mikethehacker"

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