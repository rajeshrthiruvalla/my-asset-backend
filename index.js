require('dotenv').config();
const express=require('express')
const path = require('path')
const app=express()
const {connectDB}= require('./config/db');
connectDB();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const auth=require('./routes/auth')
const main=require('./routes/main')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/google-auth', (req, res) => {
  const queryParams = new URLSearchParams(req.query).toString();

  const intentUrl = `intent://auth?${queryParams}#Intent;scheme=myapp;package=com.argsolution.myasset;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.argsolution.myasset;end`;

  res.redirect(intentUrl);
});

app.use('/',auth)
app.use('/',main)

app.listen(3000)