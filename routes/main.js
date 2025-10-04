const express=require('express')
const router=express.Router()
const multer=require('../config/multer')
const authentificate=require('../middleware/authentificate')
const validate=require('../middleware/validate')
const emailVerificate=require('../middleware/emailVerificate')
const {updateProfile,changePassword}=require('../controller/AuthController')

router.use(authentificate);
router.use(emailVerificate);
const {updateProfileValidationRules,changePasswordValidationRules}=require('../validations/authValidation')
router.post('/update-profile',updateProfileValidationRules,validate,updateProfile)
router.post('/change-password',changePasswordValidationRules,validate,changePassword)


const upload=multer('uploads/')

const {storeIcon,iconList,updateIcon}=require('../controller/IconController')

router.route('/icons')
  .get(iconList)
  .post(upload.single('image'),storeIcon)
  .put(upload.single('image'),updateIcon);

const {storeAccount,listAccount,updateAccount,ignoreAccount,restoreAccount,deleteAccount}=require('../controller/AccountController')
const {storeAccountValidationRules,updateAccountValidationRules,ignoreAccountValidationRules,deleteAccountValidationRules}= require('../validations/accountValidation');
router.route('/accounts')
      .get(listAccount)
      .post(storeAccountValidationRules,validate,storeAccount)
      .put(updateAccountValidationRules,validate,updateAccount)
      .delete(deleteAccountValidationRules,validate,deleteAccount);
router.patch('/ignore-account',ignoreAccountValidationRules,validate,ignoreAccount);
router.patch('/restore-account',ignoreAccountValidationRules,validate,restoreAccount);


const {storeTransaction,listTransaction,updateTransaction,analysis,search, deleteTransaction}=require('../controller/TransactionController')
const {storeTransactionValidationRules,updateTransactionValidationRules,deleteTransactionValidationRules}= require('../validations/transactionValidation');
router.route('/transactions')
      .get(listTransaction)
      .post(storeTransactionValidationRules,validate,storeTransaction)
      .put(updateTransactionValidationRules,validate,updateTransaction)
      .delete(deleteTransactionValidationRules,validate,deleteTransaction);

router.post('/analysis',analysis);
router.post('/search',search);

module.exports=router