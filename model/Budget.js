const mongoose = require('mongoose');
const BudgetSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  limit:{
    type: Number,
    required: true,
    default: 0
  },
  month:{
    type: Number,
    required: false
  },
  year:{
    type: Number,
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
const Budget = mongoose.model('Budget', BudgetSchema);

module.exports=Budget;