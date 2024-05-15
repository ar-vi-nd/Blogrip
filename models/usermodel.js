const mongoose = require('mongoose')
const {Schema} = mongoose
const saltRounds = 10
const bcrypt = require('bcrypt')
const { createjwt } = require('../services/authentication')


const userSchema = new Schema({

    name : {type : String,
        required : true
    },
    email : {type : String,
        required : true,
        unique :true
       
    },
    password : {type : String,
        required : true
    },
    profilepic : {
        type : String,
        default : '../uploads/User-Profile.png'
    }

})

userSchema.pre("save",async function(next){
    const user = this
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(user.password,salt)
    this.password = hash
    next()
})

userSchema.static("comparePassword",async function(email,password){
    const user = await User.findOne({email:email})
    if(!user)
        throw new Error("User Not Found");
    else{
        const match = await bcrypt.compare(password,user.password)
        if(match)
            {
              const token =  createjwt(user)
              return token
            }
        else
        return false
    }
})

const User = mongoose.model("user",userSchema)

module.exports= User