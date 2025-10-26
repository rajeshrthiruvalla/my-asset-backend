const express=require('express')
const router=express.Router()
const validate=require('../middleware/validate')
const {register,login,verifyEmail,forgotPassword,googleLogin,deleteAccount,deleteAccountSubmit,deleteAccountVerifyEmail}=require('../controller/AuthController')
const {registerValidationRules,loginValidationRules,forgotPasswordValidationRules} = require('../validations/authValidation')
router.post('/register',registerValidationRules, validate,register)
router.post('/login',loginValidationRules, validate,login)
router.get('/verify-email',verifyEmail)
router.post('/forgot-password',forgotPasswordValidationRules,validate,forgotPassword)
// router.get('/google-auth',googleLogin)
router.get('/delete-account',deleteAccount);
router.post('/delete-account-submit',loginValidationRules, validate,deleteAccountSubmit)
router.get('/delete-account-verify-email',deleteAccountVerifyEmail)

module.exports=router