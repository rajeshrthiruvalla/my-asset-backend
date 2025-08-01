const express=require('express')
const app=express()
const {connectDB}= require('./config/db');
connectDB();
app.use(express.json())
const auth=require('./routes/auth')
const main=require('./routes/main')

app.use('/',auth)
app.use('/',main)
app.listen(3000)