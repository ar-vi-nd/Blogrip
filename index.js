const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const port = 8080
const mongoURI = "mongodb://127.0.0.1/Blogrip";
const connecttodatabase = require('./dbconnect')
const cookieparser = require('cookie-parser')

connecttodatabase(mongoURI)()

app.use(cookieparser())


app.use(express.static(path.resolve('./public')))
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.set('view engine','ejs')
app.set('views','./views')

const userroute = require('./routes/userroute')

app.use('/', userroute)



app.listen(port , ()=>{console.log(`Server started at port ${port}`)})
