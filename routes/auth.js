const express=require('express')
const router=express.Router()
const validate=require('../middleware/validate')
const {register,login}=require('../controller/AuthController')
const registerValidationRules = require('../validations/registerValidation')
const loginValidationRules = require('../validations/loginValidation')
router.post('/register',registerValidationRules, validate,register)
router.post('/login',loginValidationRules, validate,login)

module.exports=router