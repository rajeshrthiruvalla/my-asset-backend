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
    const transactions =await Transaction.find({userId});
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