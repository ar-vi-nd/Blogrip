const mongoose = require('mongoose')
const {Schema} = mongoose

const blogSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    coverpic : {
        type : String,
        required : false
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user"
    }
},{timestamps:true})

const Blogs = mongoose.model("blogs",blogSchema)
module.exports = Blogs