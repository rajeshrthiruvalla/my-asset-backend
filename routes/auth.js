const express=require('express')
const router=express.Router()
const validate=require('../middleware/validate')
const {register,login,verifyEmail}=require('../controller/AuthController')
const registerValidationRules = require('../validations/registerValidation')
const loginValidationRules = require('../validations/loginValidation')
router.post('/register',registerValidationRules, validate,register)
router.post('/login',loginValidationRules, validate,login)
router.get('/verify-email',verifyEmail)

module.exports=router