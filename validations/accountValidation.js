const { body } = require('express-validator');
const mongoose = require('mongoose');
const Icon = require('../model/Icon');
const Account = require('../model/Account');
const Transaction = require('../model/Transaction');

const storeAccountValidationRules = [
  // Name validation
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .bail()
    .custom(async (value, { req }) => {
      const userId= req.token.userId;
      const existingAccount = await Account.findOne({
        name: value,
        userId
      });
      if (existingAccount) {
        throw new Error('Name is already in use by another account');
      }
      return true;
    }),

  // Opening (amount) validation
 body('opening')
    .custom((value, { req }) => {
      if (req.body.type !== 'account') {
        return true; // Skip validation
      }

      if (value === undefined || value === null || value === '') {
        throw new Error('Opening is required');
      }

      if (isNaN(value) || parseFloat(value) < 0) {
        throw new Error('Opening must be a non-negative number');
      }

      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Opening amount cannot have more than 2 decimal places');
      }

      return true;
    }),

  // IconId (ObjectId) validation
  body('iconId')
    .trim()
    .notEmpty()
    .withMessage('Icon is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('IconId must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value) => {
      const iconExists = await Icon.exists({ _id: value });
      if (!iconExists) {
        throw new Error('IconId does not exist in the Icon collection');
      }
      return true;
    }),
    body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .bail()
    .isIn(['income', 'expense', 'account'])
    .withMessage('Type must be one of: income, expense, or account')
];

const updateAccountValidationRules = [
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
      const idExists = await Account.exists({ _id: value, userId });
      if (!idExists) {
        throw new Error('id does not exist in the Account collection');
      }
      return true;
    }),
  // Name validation
 body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .bail()
    .custom(async (value, { req }) => {
      const accountId = req.body.id; // Get the id from the request body
      const userId= req.token.userId;
      const existingAccount = await Account.findOne({
        name: value,
        _id: { $ne: accountId }, // Exclude the current account
        userId
      });
      if (existingAccount) {
        throw new Error('Name is already in use by another account');
      }
      return true;
    }),

  // Opening (amount) validation
 body('opening')
    .custom((value, { req }) => {
      if (req.body.type !== 'account') {
        return true; // Skip validation
      }

      if (value === undefined || value === null || value === '') {
        throw new Error('Opening is required');
      }

      if (isNaN(value) || parseFloat(value) < 0) {
        throw new Error('Opening must be a non-negative number');
      }

      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Opening amount cannot have more than 2 decimal places');
      }

      return true;
    }),

  // IconId (ObjectId) validation
  body('iconId')
    .trim()
    .notEmpty()
    .withMessage('Icon is required')
    .bail()
    .custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('IconId must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .bail()
    .custom(async (value) => {
      const iconExists = await Icon.exists({ _id: value });
      if (!iconExists) {
        throw new Error('IconId does not exist in the Icon collection');
      }
      return true;
    }),
    body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .bail()
    .isIn(['income', 'expense', 'account'])
    .withMessage('Type must be one of: income, expense, or account')
];

const ignoreAccountValidationRules = [
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
      const idExists = await Account.exists({ _id: value, userId });
      if (!idExists) {
        throw new Error('id does not exist in the Account collection');
      }
      return true;
    })
];

const deleteAccountValidationRules = [
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
      let idExists = await Account.exists({ _id: value, userId });
      if (!idExists) {
        throw new Error('id does not exist in the Account collection');
      }
       idExists = await Transaction.exists({
                                            $or: [
                                              { fromAccountId: value },
                                              { toAccountId: value }
                                            ]
                                          });
      if (idExists) {
        throw new Error('can not delete, Account having transactions');
      }
      return true;
    })
];
module.exports = {storeAccountValidationRules,updateAccountValidationRules,ignoreAccountValidationRules,deleteAccountValidationRules};