const express=require('express')
const router=express.Router()
const validate=require('../middleware/validate')
const {register,login,verifyEmail,forgotPassword,changePassword}=require('../controller/AuthController')
const {registerValidationRules,loginValidationRules,forgotPasswordValidationRules} = require('../validations/authValidation')
router.post('/register',registerValidationRules, validate,register)
router.post('/login',loginValidationRules, validate,login)
router.get('/verify-email',verifyEmail)
router.post('/forgot-password',forgotPasswordValidationRules,validate,forgotPassword)

module.exports=router