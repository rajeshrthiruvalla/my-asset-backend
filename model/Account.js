const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  opening: {
    type: Number,
    required: true,
    default: 0
  },
  type:{
    type: String,
    required: true,
    trim: true
  },
  iconId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Icon',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false 
  },
}, {
  timestamps: true
});
const Account = mongoose.model('Account', AccountSchema);

module.exports=Account;