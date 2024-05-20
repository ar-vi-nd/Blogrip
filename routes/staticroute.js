const express = require("express");
const Blogs = require("../models/blogmodel");
const Comments = require('../models/commentmodel')

const { fetchuser } = require("../middlewares/authentication");

const router = express.Router();

router.get("/", fetchuser, async (req, res) => {
    try {
        let blogs = await Blogs.find({})
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
        let author = await blog.populate("createdBy")
        let comments = await Comments.find({blogId:req.params.id}).populate("createdBy")

        // here my first mistake was i was using find instead of findOne so i was getting an array of objects instead of object
        // also i wanted to also mention the creater name so i was confused how to do that
        // now  i have used 
        //  .populate to achieve that , .populate receives the key that will be available in the blog objectid that refers to another object (in this case "createdBy") as parameter(not sure about other parameters)
        // and attach the original object, object.createdBy is actually refering to, in this case the original user object

        // console.log(blog)
        // console.log(author)
        // console.log(comments)
        return res.render('blog',{blog:blog,user:req.user,comments:comments})      
    } catch (error) {
        console.log("error fetching blog : ",error)      
    }
  }
)

module.exports = router;
