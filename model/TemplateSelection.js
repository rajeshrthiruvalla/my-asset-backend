const mongoose = require('mongoose');
const TemplateSelectionSchema = new mongoose.Schema({
  templateId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmsTemplate', 
    required: false 
  },
  from: {
    type: String,
    required: false 
  },
  to: {
    type: String,
    required: false 
  },
  fromId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', 
    required: false 
  },
  toId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', 
    required: false 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false 
  },
}, {
  timestamps: true
});
const TemplateSelection = mongoose.model('TemplateSelection', TemplateSelectionSchema);

module.exports=TemplateSelection;