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
    try{

        const comment = await Comments.create({title : title,blogId:req.params.id,createdBy:req.user._id})
    }catch(error){
        console.log("error posting comment ",error)
    }

    return res.redirect(`/${req.params.id}`)
})
.get('/userblogs',fetchuser,async(req,res)=>{
    try{

        let blogs = await Blogs.find({createdBy:req.user._id}).populate('createdBy')
        if(blogs.length===0){
            blogs = undefined
        }
        return res.render('userblogs',{blogs:blogs,user:req.user})  
    }catch(error){
        console.log('error fetching users blogs : ',error)
    }
    })
.post('/delete/:id',fetchuser,async(req,res)=>{
            const {id} = req.params
            // console.log(id)
            try{
    
                const blog = await Blogs.findOneAndDelete({_id : id})
                if(blog){
                    try{
    
    
                        let blogs = await Blogs.find({createdBy:req.user._id}).populate('createdBy')
            if(blogs.length===0){
                blogs = undefined
            }
            return res.render('userblogs',{blogs:blogs,user:req.user})  
                    }catch(error){
                        console.log("error fetching remaining blogs after deleting blogs ",error)
                    }
    
                }
            }catch(error){
                console.log("error deleting blog ",error)
            }
    
    
        })
.post('/editblog/:id',fetchuser,upload.single('coverpic'),async(req,res)=>{
    const {id} = req.params
    const{title,description} = req.body
   
    try {
        const blog = await Blogs.findOne({_id : id})
        // console.log(blog)
                if(!blog){
                    return res.render('blog',{user:req.user,error: "No such blog exist..."}) 

                }else{
                    console.log(blog.createdBy)
                    console.log(req.user._id)
                    if(blog.createdBy.toString() !== req.user._id){
                        return res.render('blog',{user:req.user,error: "Unauthorized Request..."}) 
                    }
                    try{
                        let update = {}

                        if (title !== undefined || title!= blog.title) {
                            update.title = title;
                        }
                        
                        if (description !== undefined|| description !== blog.description) {
                            update.description = description;
                        }
                        
                        if (req.file) {
                            update.coverpic = '/uploads/'+req.file.filename
                        }

                        console.log(update)

                        let updatedblog = await Blogs.findByIdAndUpdate({_id:id},{$set:update},{new:true}).populate('createdBy')
            
            return res.redirect(`/${updatedblog._id}`)  
                    }catch(error){
                        console.log("error fetching remaining blogs after editing blogs ",error)
                    }
    
                }
            return res.redirect(`/${id}`)
        
    } catch (error) {
        console.log("error editing blog :", error)
    }
})



module.exports = router