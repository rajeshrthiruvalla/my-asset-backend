const { body } = require('express-validator')

const changePasswordValidationRules = [
  
  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)'),

  // Confirm Password validation
  body('confirm_password')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')

]


const forgotPasswordValidationRules = [
  
  // Email validation
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()

]

const loginValidationRules = [
  
  // Email validation
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required')

]

const registerValidationRules = [
  // Name validation
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  // Email validation
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  // Currency validation
  body('currency')
    .trim()
    .notEmpty().withMessage('Currency is required')
    .isIn(['$','₹']).withMessage('Currency must be USD or INR'),

  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)'),

  // Confirm Password validation
  body('confirm_password')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
]

const updateProfileValidationRules = [
  
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('currency')
    .trim()
    .notEmpty().withMessage('Currency is required')
    .isIn(['$','₹']).withMessage('Currency must be USD or INR'),

]
module.exports = {changePasswordValidationRules,forgotPasswordValidationRules,loginValidationRules,registerValidationRules,updateProfileValidationRules}