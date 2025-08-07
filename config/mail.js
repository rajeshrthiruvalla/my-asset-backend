const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//   service: 'your-email-service', // e.g., 'gmail'
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // '127.0.0.1'
  port: 25, // 25 (ensure it’s a number)
  secure: false, // No SSL/TLS for Papercut
  // No auth field needed for Papercut
});
module.exports=transporter;