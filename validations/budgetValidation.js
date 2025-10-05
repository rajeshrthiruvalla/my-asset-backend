const { body } = require('express-validator');
const mongoose = require('mongoose');
const Account = require('../model/Account');
const Budget = require('../model/Budget');

const storeBudgetValidationRules = [
  body('accountId')
    .trim()
    .notEmpty()
    .withMessage('Expense is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Expense must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      const accountExists = await Account.exists({ _id: value,userId,type:'expense' });
      if (!accountExists) {
        throw new Error('Account does not exist');
      }
      return true;
    }),
  body('limit')
    .trim()
    .notEmpty()
    .withMessage('Limit is required')
    .isFloat({ min: 0 })
    .withMessage('Limit must be a non-negative number')
    .bail()
    .custom((value) => {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Limit cannot have more than 2 decimal places');
      }
      return true;
    }),
body('month')
  .trim()
  .notEmpty()
  .withMessage('Month is required')
  .bail()
  .isInt({ min: 1, max: 12 })
  .withMessage('Invalid Month')
  .toInt(),

body('year')
  .trim()
  .notEmpty()
  .withMessage('Year is required')
  .bail()
  .isInt({ min: 1900, max: 2100 })
  .withMessage('Year must be a valid four-digit number')
  .toInt(),
];

const updateBudgetValidationRules = [
body('id')
    .trim()
    .notEmpty()
    .withMessage('id is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('id must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      const idExists = await Budget.exists({ _id: value,userId });
      if (!idExists) {
        throw new Error('id does not exist in the Budget collection');
      }
      return true;
    }),
    body('accountId')
    .trim()
    .notEmpty()
    .withMessage('Expense is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Expense must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      const accountExists = await Account.exists({ _id: value,userId,type:'expense' });
      if (!accountExists) {
        throw new Error('Account does not exist');
      }
      return true;
    }),
  body('limit')
    .trim()
    .notEmpty()
    .withMessage('Limit is required')
    .isFloat({ min: 0 })
    .withMessage('Limit must be a non-negative number')
    .bail()
    .custom((value) => {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Limit cannot have more than 2 decimal places');
      }
      return true;
    })
];

const deleteBudgetValidationRules = [
body('id')
    .trim()
    .notEmpty()
    .withMessage('id is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('id must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      const idExists = await Budget.exists({ _id: value,userId });
      if (!idExists) {
        throw new Error('id does not exist in the Budget collection');
      }
      return true;
    })];

module.exports = {storeBudgetValidationRules,updateBudgetValidationRules,deleteBudgetValidationRules};