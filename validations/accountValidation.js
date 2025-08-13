const { body } = require('express-validator');
const mongoose = require('mongoose');
const Icon = require('../model/Icon');
const Account = require('../model/Account');

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
    .trim()
    .notEmpty()
    .withMessage('Opening is required')
    .isFloat({ min: 0 })
    .withMessage('Opening must be a non-negative number')
    .bail()
    .custom((value) => {
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
    .custom(async (value) => {
      const idExists = await Account.exists({ _id: value });
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
    .trim()
    .notEmpty()
    .withMessage('Opening is required')
    .isFloat({ min: 0 })
    .withMessage('Opening must be a non-negative number')
    .bail()
    .custom((value) => {
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
];

module.exports = {storeAccountValidationRules,updateAccountValidationRules};