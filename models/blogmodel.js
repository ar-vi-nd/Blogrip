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


// the blog will still get deleted if i dont write the pre function but 
// its better to delete all the information related to this blog like comments


blogSchema.pre('findOneAndDelete', async function(next) {
    const blogId = this.getQuery()._id;
    try {
        await mongoose.model('comments').deleteMany({ blogId: blogId });
        next();
    } catch (err) {
        next(err);
    }
});

const Blogs = mongoose.model("blogs",blogSchema)
module.exports = Blogs