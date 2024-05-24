const express = require("express");
const Blogs = require("../models/blogmodel");
const Comments = require('../models/commentmodel')

const { fetchuser } = require("../middlewares/authentication");

const router = express.Router();

router.get("/", fetchuser, async (req, res) => {
    try {
        let blogs = await Blogs.find({}).sort({'createdAt':-1})
        if(blogs.length===0){
            blogs = undefined
        }
        return res.render('blogs',{blogs:blogs,user:req.user})      
    } catch (error) {
        console.log("error fetching blogs : ",error)      
    }
  }).get("/:id",fetchuser,async(req,res)=>{
    try {
        let blog = await Blogs.findOne({_id:req.params.id})
        if (blog.length!==0){
            let author = await blog.populate("createdBy")
            let comments = await Comments.find({blogId:req.params.id}).populate("createdBy")
        return res.render('blog',{blog:blog,user:req.user,comments:comments})      

        }
        else{
            return res.render('blog',{user:req.user,error: "No such blog exist..."}) 
        }
       
        // here my first mistake was i was using find instead of findOne so i was getting an array of objects instead of object
        // also i wanted to also mention the creater name so i was confused how to do that
        // now  i have used 
        //  .populate to achieve that , .populate receives the key that will be available in the blog objectid that refers to another object (in this case "createdBy") as parameter(not sure about other parameters)
        // and attach the original object, object.createdBy is actually refering to, in this case the original user object

        // console.log(blog)
        // console.log(author)
        // console.log(comments)
    } catch (error) {
        console.log("error fetching blog in staticroute on .get('/:id') : ",error)      
    }
  }
)

// i dont know why but for some time i was getting a favicon request at this route .get('/:id')
// every time i tried to refresh a page or open a blog or do anything dont know why
// fixed it by restoring this file by that git command which takes it to the previous version
// then again i made same changes but now  i am not getting the same error
// nope still getting same error


module.exports = router;
