const mongoose = require('mongoose')

const connecttodatabase = (mongooseuri)=>{
return async ()=>{
    await mongoose.connect(mongooseuri)
    console.log("connected to mongodb successfully")
}
}

module.exports = connecttodatabase