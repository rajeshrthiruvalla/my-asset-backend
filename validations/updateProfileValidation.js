const { body } = require('express-validator')

const updateProfileValidationRules = [
  
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('currency')
    .trim()
    .notEmpty().withMessage('Currency is required')
    .isIn(['USD', 'EUR', 'GBP', 'INR']).withMessage('Currency must be one of: USD, EUR, GBP, INR'),

]



module.exports = updateProfileValidationRules