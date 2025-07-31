const express=require('express')
const router=express.Router()
const validate=require('../middleware/validate')
const {register}=require('../controller/AuthController')
const registerValidationRules = require('../validations/registerValidation')
router.post('/register',registerValidationRules, validate,register)

module.exports=router