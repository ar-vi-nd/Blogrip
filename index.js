require('dotenv').config()

// To use the values from your .env file in your middleware, you just need to ensure that you load the .env file using dotenv in your main application file (e.g., index.js). Once you've done that, the values will be accessible through process.env in any middleware or other parts of your application.


const express = require('express')
const mongoose = require('mongoose')

const path = require('path')
const app = express()
const port = 5000
const mongoURI = "mongodb://127.0.0.1/Blogrip";
const connecttodatabase = require('./dbconnect')
const cookieparser = require('cookie-parser')

connecttodatabase(mongoURI)()


// included this method .override because it converts post request to other type of request
// say you are using form to send a delete request but forms can only send get or post request
{/* <form action="/api/blog/delete/<%= blog._id %>" method="POST" style="display:inline;">
    <input type="hidden" name="_method" value="DELETE">
    <button type="submit" class="btn btn-danger">DELETE</button>
    </form> */}
// you write this input  line inside form 
// and this middleware changes the post request to delete request but its not working
// but it isnt working

// const methodOverride = require('method-override');
// // console.log(methodOverride)
// app.use(methodOverride('_method'))

// thats why i am using a post route to handle delete request which is not a good way 
// i can use ajax request that would be a better way




app.use(cookieparser())

// it just making a folder static doesnt mean you would be able to serve get these files from anywhere just by 
//  making src = 'file-name'
// but actually it is used to serve static files 
// and from where to get these static files totally depends on your current url and not your current folder
// eg. in both blog and userprofile.ejs i am providing source of image as its name
// but blog.ejs is rendered from ('/') route thats why its able to get the file just by using the filename
// but in case of userprofile.ejs its rendered from ( '/api/user/userprofile) thats why i need to add ../ along with
// filename because of its relative file position

// chat gpt said this explaination is wrong
// but my website is working fine using this method
app.use(express.static(path.resolve('./public')))
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.set('view engine','ejs')
app.set('views','./views')

const userroute = require('./routes/userroute')
const blogroute = require('./routes/blogroute')
const staticroute = require('./routes/staticroute')

app.use('/',staticroute)
app.use('/api/user', userroute)
app.use('/api/blog',blogroute)


app.listen(process.env.port || port , ()=>{console.log(`Server started at port ${process.env.port||port}`)})
