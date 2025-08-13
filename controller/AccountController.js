const Account=require('../model/Account')

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

const listAccount=async (req,res)=>{
    const userId= req.token.userId; 
    const accounts =await Account.find({userId});
      res.json({
        message: `Account List`,
        data:accounts
      });
}

const updateAccount=async (req,res)=>{
    const {name,opening,iconId,id}= req.body;
    const account =await Account.findById(id);
    account.name=name;
    account.opening=opening;
    account.iconId=iconId
       await account.save();
      res.json({
        message: `Updated successfully`,
        data:account
      });
}
module.exports={storeAccount,listAccount,updateAccount}