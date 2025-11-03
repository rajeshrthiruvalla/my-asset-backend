const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  currency: String,
  password: String,
  verificationToken: String,
  verificationTokenExpiry: Date,
  isVerified: { type: Boolean, default: false },
  googleId: String,
  photo:String
});
const User = mongoose.model('User', UserSchema);

module.exports=User;