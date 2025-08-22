const { body } = require('express-validator');
const mongoose = require('mongoose');
const Account = require('../model/Account');
const Transaction = require('../model/Transaction');

const storeTransactionValidationRules = [
  // fromAccountId (ObjectId) validation
  body('fromAccountId')
    .trim()
    .notEmpty()
    .withMessage('From Account is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('AccountId must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      const accountExists = await Account.exists({ _id: value,userId,type:'account' });
      if (!accountExists) {
        throw new Error('Account does not exist');
      }
      return true;
    }),
  // toAccountId (ObjectId) validation
  body('toAccountId')
    .trim()
    .notEmpty()
    .withMessage('To Account is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('AccountId must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom((value,{req}) => value!==req.body.fromAccountId).withMessage('From and To Account can not same')
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      let condition={ _id: value,userId };
      switch(req.body.type)
      {
        case 'income':condition={...condition,type:'income'};break;
        case 'expence':condition={...condition,type:'income'};break;
        case 'transfer':condition={...condition,type:'account'};break;
      }
      const accountExists = await Account.exists(condition);
      if (!accountExists) {
        throw new Error('Account does not exist');
      }
      return true;
    }),
  // Opening (amount) validation
  body('amount')
    .trim()
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number')
    .bail()
    .custom((value) => {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Amount cannot have more than 2 decimal places');
      }
      return true;
    }),
  // Description validation
  body('description')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be between 2 and 500 characters'),
// Type validation
body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .bail()
    .isIn(['income', 'expense', 'account'])
    .withMessage('Type must be one of: income, expense, or account'),
  // entryAt validation
  body('entryAt')
    .trim()
    .notEmpty()
    .withMessage('entryAt is required')
    .bail()
    .isISO8601().withMessage('Date format must be ISO8601 (e.g. 2025-08-16T13:15:00Z)')
    .toDate() // converts string → JS Date
    
];

const updateTransactionValidationRules = [
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
      const idExists = await Transaction.exists({ _id: value,userId });
      if (!idExists) {
        throw new Error('id does not exist in the Transaction collection');
      }
      return true;
    }),
  // fromAccountId (ObjectId) validation
  body('fromAccountId')
    .trim()
    .notEmpty()
    .withMessage('From Account is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('AccountId must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      const accountExists = await Account.exists({ _id: value,userId,type:'account' });
      if (!accountExists) {
        throw new Error('Account does not exist');
      }
      return true;
    }),
  // toAccountId (ObjectId) validation
  body('toAccountId')
    .trim()
    .notEmpty()
    .withMessage('To Account is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('AccountId must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom((value,{req}) => value!==req.body.fromAccountId).withMessage('From and To Account can not same')
    .custom(async (value,{req}) => {
      const userId= req.token.userId;
      let condition={ _id: value,userId };
      switch(req.body.type)
      {
        case 'income':condition={...condition,type:'income'};break;
        case 'expence':condition={...condition,type:'income'};break;
        case 'transfer':condition={...condition,type:'account'};break;
      }
      const accountExists = await Account.exists(condition);
      if (!accountExists) {
        throw new Error('Account does not exist');
      }
      return true;
    }),
  // Opening (amount) validation
  body('amount')
    .trim()
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number')
    .bail()
    .custom((value) => {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Amount cannot have more than 2 decimal places');
      }
      return true;
    }),
  // Description validation
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 2, max: 500 })
    .withMessage('Description must be between 2 and 500 characters'),
// Type validation
body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .bail()
    .isIn(['income', 'expense', 'account'])
    .withMessage('Type must be one of: income, expense, or account'),
  // entryAt validation
  body('entryAt')
    .trim()
    .notEmpty()
    .withMessage('entryAt is required')
    .bail()
    .isDate().withMessage('Date format is incorrect')
];

module.exports = {storeTransactionValidationRules,updateTransactionValidationRules};