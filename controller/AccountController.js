const Account=require('../model/Account');
const Transaction = require('../model/Transaction');

const storeAccount=async (req,res)=>{
    const {name,opening,iconId,type}= req.body;
    const userId= req.token.userId; 
    const account = new Account({ name,
                        opening, 
                        iconId,
                        userId,
                        type
                        });
       await account.save();
      res.json({
        message: `Saved successfully`,
        data:account
      });
}

const listAccount = async (req, res) => {
  const userId = req.token.userId; 
  const { type } = req.query;

  const accounts = await Account.find({ userId, type });

  const updatedAccounts = await Promise.all(
    accounts.map(async (accountDoc) => {
      // convert Mongoose document to plain JS object
      const account = accountDoc.toObject();

      // Sum outgoing
      let result = await Transaction.aggregate([
        { $match: { fromAccountId: account._id } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      const from = result.length > 0 ? result[0].total : 0;

      // Sum incoming
      result = await Transaction.aggregate([
        { $match: { toAccountId: account._id } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      const to = result.length > 0 ? result[0].total : 0;

      // Balance
      const balance = to - from;
      account.balance = balance.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return account;
    })
  );

  res.json({
    message: "Account List",
    data: updatedAccounts
  });
};

const updateAccount=async (req,res)=>{
    const {name,opening,iconId,type,id}= req.body;
    const account =await Account.findById(id);
    account.name=name;
    account.opening=opening;
    account.iconId=iconId;
    account.type=type;
       await account.save();
      res.json({
        message: `Updated successfully`,
        data:account
      });
}

const ignoreAccount=async (req,res)=>{
  const {id}= req.body;
  const account =await Account.findById(id);
  account.ignore=true;
  await account.save();
      res.json({
        message: `Ignored successfully`,
        data:account
      });
}

const restoreAccount=async (req,res)=>{
  const {id}= req.body;
  const account =await Account.findById(id);
  account.ignore=false;
  await account.save();
      res.json({
        message: `Restored successfully`,
        data:account
      });
}

const deleteAccount=async (req,res)=>{
  const {id}= req.body;
  await Account.findByIdAndDelete(id);
      res.json({
        message: `Deleted successfully`
      });
}
module.exports={storeAccount,listAccount,updateAccount,ignoreAccount,restoreAccount,deleteAccount}