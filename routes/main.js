const express=require('express')
const router=express.Router()
const authentificate=require('../middleware/authentificate')
const validate=require('../middleware/validate')
const {updateProfile}=require('../controller/AuthController')

const updateProfileValidationRules=require('../validations/updateProfileValidation')
router.post('/update-profile',updateProfileValidationRules,validate,authentificate,updateProfile)

module.exports=router