const express=require('express')
const router=express.Router()
const validate=require('../middleware/validate')
const {register,login,verifyEmail,forgotPassword,changePassword}=require('../controller/AuthController')
const registerValidationRules = require('../validations/registerValidation')
router.post('/register',registerValidationRules, validate,register)
const loginValidationRules = require('../validations/loginValidation')
router.post('/login',loginValidationRules, validate,login)
router.get('/verify-email',verifyEmail)
const forgotPasswordValidationRules = require('../validations/forgotPasswordValidation')
router.post('/forgot-password',forgotPasswordValidationRules,validate,forgotPassword)

module.exports=router