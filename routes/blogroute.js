const express = require("express")
const path = require('path')
const router = express.Router()

const multer  = require('multer')
const Blogs = require('../models/blogmodel')
const Comments = require('../models/commentmodel')


const {fetchuser} = require('../middlewares/authentication')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
     return cb(null, "./public/uploads/")
    },
    filename: function (req, file, cb) {
     return cb(null, `${Date.now()}-${file.originalname}`)
    }
  })

  const upload = multer({ storage: storage })


router
.get('/',fetchuser,(req,res)=>{
    return res.render('addblog',{user:req.user})
})
.post('/',fetchuser, upload.single('coverpic'),async (req,res)=>{
    // console.log(req.body)
    // console.log(req.file)
    const {title,description} = req.body
    const blog = await Blogs.create({
        title,description,coverpic:`/uploads/${req.file.filename}`,createdBy:req.user._id
    })

    await blog.populate("createdBy")
    // console.log(blog)

    // return res.render('blog',{blog:blog,user:req.user})
    return res.redirect(`/${blog._id}`)
    
})
.post('/:id',fetchuser,async(req,res)=>{
    const {title} = req.body
    const comment = await Comments.create({title : title,blogId:req.params.id,createdBy:req.user._id})

    return res.redirect(`/${req.params.id}`)
})

module.exports = router