const express = require("express");
const User = require("../models/usermodel");
const multer  = require('multer')

const { fetchuser } = require("../middlewares/authentication");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   return cb(null, "./public/uploads/")
  },
  filename: function (req, file, cb) {
   return cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

const router = express.Router();

router
  .get("/", fetchuser, async (req, res) => {
    console.log(req.user);

    res.render("home", { user: req.user });
  })
  .get("/login", (req, res) => {
    return res.render("login");
  })
  .post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await User.comparePassword(email, password);
      if (token) {
        res.cookie("token", token);
        return res.redirect("/");
      } else
        return res
          .status(400)
          .render("login", { error: "Invalid credentials" });
    } catch (error) {
      return res.status(404).render("login", { error: error });
    }
  })
  .get("/signup", (req, res) => {
    return res.render("signup");
  })
  .post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    try {
      if (!user) {
        user = await User.create({
          name: name,
          email: email,
          password: password,
        });
        console.log("User created successfully:", user);
      }
      res.redirect("/login");
    } catch (err) {
      console.error("Error creating user:", err);
      // Handle other errors
    }
  })
  .get('/userprofile',fetchuser,async(req,res)=>{
    console.log(req.user)
    const {name,email,profilepic}= req.user

    res.render('userprofile',{user:{name,email,profilepic}})
  })
  .post('/updateprofilepic',fetchuser,upload.single('profilepic'),async(req,res)=>{
    
    if(req.file){


      const{filename} = req.file
      let updateduser = await User.findByIdAndUpdate({_id:req.user._id},{$set:{profilepic:'/uploads/'+filename}},{new:true})
      return res.redirect('/userprofile')
    }
    else{
      const {name,email,profilepic}= req.user
      return res.render('userprofile',{user:{name,email,profilepic}})
    }



  })

  .get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  });

module.exports = router;
