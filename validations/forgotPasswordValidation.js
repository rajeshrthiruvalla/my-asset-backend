const { body } = require('express-validator')

const forgotPasswordValidationRules = [
  
  // Email validation
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()

]



module.exports = forgotPasswordValidationRules