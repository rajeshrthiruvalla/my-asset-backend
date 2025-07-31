const express=require('express')
const app=express()
const {connectDB}= require('./config/db');
connectDB();
app.use(express.json())
const auth=require('./routes/auth')

app.use('/',auth)
app.listen(3000)