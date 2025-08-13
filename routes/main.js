const express=require('express')
const router=express.Router()
const multer=require('../config/multer')
const authentificate=require('../middleware/authentificate')
const validate=require('../middleware/validate')
const emailVerificate=require('../middleware/emailVerificate')
const {updateProfile,changePassword}=require('../controller/AuthController')

router.use(authentificate);
router.use(emailVerificate);
const updateProfileValidationRules=require('../validations/updateProfileValidation')
router.post('/update-profile',updateProfileValidationRules,validate,updateProfile)
const changePasswordValidationRules = require('../validations/changePasswordValidation')
router.post('/change-password',changePasswordValidationRules,validate,changePassword)


const upload=multer('uploads/')

const {storeIcon,iconList,updateIcon}=require('../controller/IconController')

router.route('/icons')
  .get(iconList)
  .post(upload.single('image'),storeIcon)
  .put(upload.single('image'),updateIcon);

const {storeAccount,listAccount,updateAccount}=require('../controller/AccountController')
const {storeAccountValidationRules,updateAccountValidationRules}= require('../validations/accountValidation');
router.route('/accounts')
      .get(listAccount)
      .post(storeAccountValidationRules,validate,storeAccount)
      .put(updateAccountValidationRules,validate,updateAccount)

module.exports=router