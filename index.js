require('dotenv').config();
const express=require('express')
const path = require('path')
const app=express()
const {connectDB}= require('./config/db');
connectDB();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json())
const auth=require('./routes/auth')
const main=require('./routes/main')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.all('/google-auth', (req, res) => {
const queryParams = req.query || {};
  const bodyParams = req.body || {};

  res.render('Params', {  // Note: Match your filename 'Params.ejs' (case-sensitive)
    method: req.method,
    queryParams,
    bodyParams
  });
})
app.use('/',auth)
app.use('/',main)
app.use(express.urlencoded({ extended: true }))

app.listen(3000)