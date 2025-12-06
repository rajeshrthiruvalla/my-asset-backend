const mongoose = require('mongoose');
const SmsTemplateSchema = new mongoose.Schema({
  sms: {
    type: String,
    required: true
  },
  template:{
    type: String,
    required: true,
  },
  type:{
    type: String,
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
const SmsTemplate = mongoose.model('SmsTemplate', SmsTemplateSchema);

module.exports=SmsTemplate;