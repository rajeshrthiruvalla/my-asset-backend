const { default: mongoose } = require('mongoose');
const Transaction=require('../model/Transaction')

const storeTransaction=async (req,res)=>{
    const {fromAccountId,toAccountId,amount,description,type,entryAt}= req.body;
    const userId= req.token.userId; 
    const transaction = new Transaction({ fromAccountId,
                        toAccountId, 
                        amount,
                        description,
                        type,
                        entryAt,
                        userId
                        });
       await transaction.save();
      res.json({
        message: `Saved successfully`,
        data:transaction
      });
}

const listTransaction=async (req,res)=>{
    const userId= req.token.userId; 
    const { fromDate, toDate } = req.query;
    const fromDateObject=new Date(`${fromDate}T00:00:00.000Z`);
    const toDateObject=new Date(`${toDate}T23:59:59.999Z`);
    const transactions = await Transaction.aggregate([
                          // filter by userId
                          {
                            $match: {
                              userId: new mongoose.Types.ObjectId(userId),
                              entryAt: { $gte: fromDateObject, $lte: toDateObject } 
                            }
                          },

                          // join fromAccountId -> Account
                          {
                            $lookup: {
                              from: "accounts",
                              localField: "fromAccountId",
                              foreignField: "_id",
                              as: "fromAccount"
                            }
                          },
                          { $unwind: "$fromAccount" },

                          // join fromAccount.iconId -> Icon
                          {
                            $lookup: {
                              from: "icons",
                              localField: "fromAccount.iconId",
                              foreignField: "_id",
                              as: "fromIcon"
                            }
                          },
                          { $unwind: "$fromIcon" },

                          // join toAccountId -> Account
                          {
                            $lookup: {
                              from: "accounts",
                              localField: "toAccountId",
                              foreignField: "_id",
                              as: "toAccount"
                            }
                          },
                          { $unwind: "$toAccount" },

                          // join toAccount.iconId -> Icon
                          {
                            $lookup: {
                              from: "icons",
                              localField: "toAccount.iconId",
                              foreignField: "_id",
                              as: "toIcon"
                            }
                          },
                          { $unwind: "$toIcon" },

                          // select only the fields you need
                          {
                            $project: {
                              fromAccountId:"$fromAccountId",
                              toAccountId:"$toAccountId",
                              amount: "$amount",
                              description: "$description",
                              entryAt:"$entryAt",
                              type:"$type",
                              userId:"$userId",
                              fromAccount: "$fromAccount.name",
                              toAccount: "$toAccount.name",
                              fromIcon: "$fromIcon.path",
                              toIcon: "$toIcon.path"
                            }
                          }
                        ]);
      res.json({
        message: `Transaction List`,
        data:transactions
      });
}

const updateTransaction=async (req,res)=>{
    const {fromAccountId,toAccountId,amount,description,type,entryAt,id}= req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { fromAccountId, toAccountId, amount, description, type, entryAt },
      { new: true, runValidators: true } // new:true returns updated doc
    );
      res.json({
        message: `Updated successfully`,
        data:transaction
      });
}

const analysis=async (req,res)=>{
    const userId= req.token.userId; 
    const { fromDate, toDate } = req.body; 
    const fromDateObject=new Date(`${fromDate}T00:00:00.000Z`);
    const toDateObject=new Date(`${toDate}T23:59:59.999Z`);
    const income = await Transaction.aggregate([
                      // 1. filter by user and type = expense
                      {
                        $match: {
                          userId: new mongoose.Types.ObjectId(userId),
                          type: 'income',
                          entryAt: { $gte: fromDateObject, $lte: toDateObject } 
                        }
                      },

                      // 2. group by toAccountId and sum amount
                      {
                        $group: {
                          _id: "$toAccountId",
                          sum_amount: { $sum: "$amount" }
                        }
                      },

                      // 3. join account to get account name
                      {
                        $lookup: {
                          from: "accounts",
                          localField: "_id",
                          foreignField: "_id",
                          as: "account"
                        }
                      },
                      { $unwind: "$account" },
                      // 4. join icon from account.iconId
                      {
                        $lookup: {
                          from: "icons",
                          localField: "account.iconId",
                          foreignField: "_id",
                          as: "icon"
                        }
                      },
                      { $unwind: "$icon" },
                      // 5. project final fields
                      {
                        $project: {
                          _id: 0,
                          account_id: "$_id",
                          account_name: "$account.name",
                          sum_amount: 1,
                          icon: "$icon.path"
                        }
                      }

                    ]);
      const expense = await Transaction.aggregate([
                      // 1. filter by user and type = expense
                      {
                        $match: {
                          userId: new mongoose.Types.ObjectId(userId),
                          type: 'expense',
                          entryAt: { $gte: fromDateObject, $lte: toDateObject } 
                        }
                      },

                      // 2. group by toAccountId and sum amount
                      {
                        $group: {
                          _id: "$toAccountId",
                          sum_amount: { $sum: "$amount" }
                        }
                      },

                      // 3. join account to get account name
                      {
                        $lookup: {
                          from: "accounts",
                          localField: "_id",
                          foreignField: "_id",
                          as: "account"
                        }
                      },
                      { $unwind: "$account" },

                      // 4. project final fields
                      {
                        $project: {
                          _id: 0,
                          account_id: "$_id",
                          account_name: "$account.name",
                          sum_amount: 1
                        }
                      }
                    ]);
       const incomePrev = await Transaction.aggregate([
                      // 1. filter by user and type = expense
                      {
                        $match: {
                          userId: new mongoose.Types.ObjectId(userId),
                          type: 'income',
                          entryAt: { $lt: fromDateObject } 
                        }
                      },

                      // 2. group by toAccountId and sum amount
                      {
                        $group: {
                          _id: null,
                          sum_amount: { $sum: "$amount" }
                        }
                      },

                      {
                        $project: {
                          _id: 0,
                          sum_amount: 1,
                        }
                      }

                    ]);
      const expensePrev =  await Transaction.aggregate([
                      // 1. filter by user and type = expense
                      {
                        $match: {
                          userId: new mongoose.Types.ObjectId(userId),
                          type: 'expense',
                          entryAt: { $lt: fromDateObject } 
                        }
                      },

                      // 2. group by toAccountId and sum amount
                      {
                        $group: {
                          _id: null,
                          sum_amount: { $sum: "$amount" }
                        }
                      },

                      {
                        $project: {
                          _id: 0,
                          sum_amount: 1,
                        }
                      }

                    ]);
      const carryForward=incomePrev[0]?.sum_amount??0-expensePrev[0]?.sum_amount??0;

      res.json({
        message: `List`,
        income,
        expense,
        carryForward
      });
}


const deleteTransaction=async (req,res)=>{
  const {id}= req.body;
  await Transaction.findByIdAndDelete(id);
      res.json({
        message: `Deleted successfully`
      });
}

const search = async (req, res) => {
  const userId = req.token.userId;
  const  {key}= req.body
if(!key)
{
    res.json({
    message: ``,
    data: []
  });
}
  const isNumber = !isNaN(Number(key));

  const orConditions = [
    { "fromAccount.name": { $regex: key, $options: "i" } },
    { "toAccount.name": { $regex: key, $options: "i" } },
    { description: { $regex: key, $options: "i" } },
  ];

  // if numeric, add amount match
  if (isNumber) {
    orConditions.push({ amount: Number(key) });
  }

  const transactions = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },

    // join fromAccountId -> Account
    {
      $lookup: {
        from: "accounts",
        localField: "fromAccountId",
        foreignField: "_id",
        as: "fromAccount"
      }
    },
    { $unwind: "$fromAccount" },

    // join fromAccount.iconId -> Icon
    {
      $lookup: {
        from: "icons",
        localField: "fromAccount.iconId",
        foreignField: "_id",
        as: "fromIcon"
      }
    },
    { $unwind: "$fromIcon" },

    // join toAccountId -> Account
    {
      $lookup: {
        from: "accounts",
        localField: "toAccountId",
        foreignField: "_id",
        as: "toAccount"
      }
    },
    { $unwind: "$toAccount" },

    // join toAccount.iconId -> Icon
    {
      $lookup: {
        from: "icons",
        localField: "toAccount.iconId",
        foreignField: "_id",
        as: "toIcon"
      }
    },
    { $unwind: "$toIcon" },

    // search filter
    {
      $match: {
        $or: orConditions
      }
    },

    // final projection
    {
      $project: {
        fromAccountId: 1,
        toAccountId: 1,
        amount: 1,
        description: 1,
        entryAt: 1,
        type: 1,
        userId: 1,
        fromAccount: "$fromAccount.name",
        toAccount: "$toAccount.name",
        fromIcon: "$fromIcon.path",
        toIcon: "$toIcon.path"
      }
    }
  ]);

  res.json({
    message: `Total ${transactions.length} matches found`,
    data: transactions
  });
};


module.exports={storeTransaction,listTransaction,updateTransaction,deleteTransaction,analysis,search}