const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST, // '127.0.0.1'
//   port: 25, // 25 (ensure it’s a number)
//   secure: false, // No SSL/TLS for Papercut
//   // No auth field needed for Papercut
// });


// Convert secure from string to boolean
const secureFlag = process.env.EMAIL_SECURE === "true";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: secureFlag, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server ready ✅");
  }
});

module.exports=transporter;