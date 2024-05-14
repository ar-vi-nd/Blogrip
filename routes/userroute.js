const express = require('express')
const User = require('../models/usermodel')
const jwt = require('jsonwebtoken')
const JWT_secret = 'miketheking'



const router = express.Router()

router.get('/',async(req,res)=>{
 
    res.render('home')
})
.get('/login',(req,res)=>{
   return res.render('login')
}).post('/login',async (req,res)=>{
    const {email,password} = req.body
    // try{
    //     const user = await User.findOne({email:email})
    //     if(!user){
    //         res.redirect('/login')
    //     }else{
    //         const passwordcompare = await bcrypt.compare(password,user.password)
    //         if(!passwordcompare){
    //            return res.redirect('/login')
    //         }
    //         return res.redirect('/')
    //     }
    // }catch(error){
    //     console.log("error logging in : ",error)
    // }
   const user =  await User.comparePassword(email,password)
   if(user){
    return res.redirect('/')
   }
   else
   return res.redirect('login')
})
.get('/signup',(req,res)=>{
   return res.render('signup')
}).post('/signup',async(req,res)=>{
    const {name,email,password} = req.body
    // try{

    //     const user = await User.create({name,email,password})
    //     console.log(user)
    //     return res.json({user})
    // }catch(error){

    //     console.log(error)
    // }
    // return res.redirect('/')
    // return res.render('home',{user})

    let user = await User.findOne({email:email})
    try{
    if(!user){
        user = await User.create({name:name,email:email,password:password
        });    
        console.log('User created successfully:', user);
    }
    res.redirect('/login')
} catch (err) {
        console.error('Error creating user:', err);
        // Handle other errors
}
})


module.exports = router