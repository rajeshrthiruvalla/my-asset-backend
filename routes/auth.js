const express=require('express')
const router=express.Router()
const validate=require('../middleware/validate')
const {register,login,verifyEmail,forgotPassword,googleLogin,deleteAccount,deleteAccountSubmit,deleteAccountVerifyEmail}=require('../controller/AuthController')
const {registerValidationRules,loginValidationRules,forgotPasswordValidationRules,googleLoginValidationRules} = require('../validations/authValidation')
router.post('/register',registerValidationRules, validate,register)
router.post('/login',loginValidationRules, validate,login)
router.get('/verify-email',verifyEmail)
router.post('/forgot-password',forgotPasswordValidationRules,validate,forgotPassword)
router.post('/google-auth',googleLoginValidationRules,validate,googleLogin)
router.get('/delete-account',deleteAccount);
router.post('/delete-account-submit',loginValidationRules, validate,deleteAccountSubmit)
router.get('/delete-account-verify-email',deleteAccountVerifyEmail)

const {listRequest,processRequest,processRequestPost}=require('../controller/SmsController')
router.get('/list-sms-request',listRequest)
router.get('/process-request',processRequest)
router.post('/process-request',processRequestPost)
module.exports=router