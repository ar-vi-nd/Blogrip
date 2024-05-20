const mongoose = require('mongoose')
const {Schema} = mongoose

const commentSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    blogId :{
        type: Schema.Types.ObjectId,
        ref : "blogs"
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user"
    }
},{timestamps:true})

const Comments = mongoose.model("comments",commentSchema)
module.exports = Comments