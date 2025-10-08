const Budget=require('../model/Budget');
const Account=require('../model/Account');
const Transaction=require('../model/Transaction');
const Icon=require('../model/Icon');

const storeBudget=async (req,res)=>{
    const { accountId, limit, month, year}= req.body;
    const userId= req.token.userId; 
    const budget = new Budget({ 
                        accountId,
                        limit, 
                        month,
                        year,
                        userId
                        });
       await budget.save();
      res.json({
        message: `Saved successfully`,
        data:budget
      });
}

const listBudget = async (req, res) => {
  const userId = req.token.userId; 
  const { month, year } = req.query;

  const expenses = await Account.find({ userId, type:'expense' });
  const updatedBudgets = await Promise.all(
    expenses.map(async (accountDoc) => {
      const account = accountDoc.toObject();

      const result = await Transaction.aggregate([
        {
          $match: {
            toAccountId: account._id,
            $expr: {
              $and: [
                { $eq: [{ $month: "$entryAt" }, month] },
                { $eq: [{ $year: "$entryAt" }, year] }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);

      const spent = result.length > 0 ? result[0].total : 0;
   
      const budget = await Budget.findOne({accountId:account._id,month,year});
      const budgetId=budget?budget._id:'';
      const limit=budget?budget.limit:'';
      const icon= await Icon.findById(account.iconId);
      return {accountId:account._id,accountName:account.name,budgetId,icon:icon.path,spent,limit,month,year};
    })
  );

  res.json({
    message: "Budget List",
    data: updatedBudgets
  });
};

const updateBudget=async (req,res)=>{
    const {budgetId, limit}= req.body;
    const budget =await Budget.findById(budgetId);
    budget.limit=limit;
    await budget.save();
      res.json({
        message: `Updated successfully`,
        data:budget
      });
}

const deleteBudget=async (req,res)=>{
  const {id}= req.body;
  await Budget.findByIdAndDelete(id);
      res.json({
        message: `Deleted successfully`
      });
}
module.exports={storeBudget,listBudget,updateBudget,deleteBudget}