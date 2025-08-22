const mongoose = require('mongoose');
const IconSchema = new mongoose.Schema({
  name: String,
  path: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false 
  },
}, {
  timestamps: true
});
const Icon = mongoose.model('Icon', IconSchema);

module.exports=Icon;