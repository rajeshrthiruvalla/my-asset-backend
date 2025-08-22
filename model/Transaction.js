const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  fromAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  amount:{
    type: Number,
    required: true,
    default: 0
  },
  description:{
    type: String,
    required: false,
    trim: true
  },
  entryAt:{
    type: Date,
    required: true
  },
  type:{
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false 
  },
}, {
  timestamps: true
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports=Transaction;