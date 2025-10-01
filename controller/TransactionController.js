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
    const transactions = await Transaction.aggregate([
                          // filter by userId
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
module.exports={storeTransaction,listTransaction,updateTransaction}