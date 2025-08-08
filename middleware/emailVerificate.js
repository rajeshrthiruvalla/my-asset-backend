const User=require('../model/User')

const emailVerificate=async (req,res,next)=>{
    try{  
        const id= req.token.userId;
        const user = await User.findById(id);
        if(!user.isVerified)
        {
            return res.status(200)
                .json(
                    {
                        success: false,
                        message: "Email not Verified"
                    }
                );
        }
        next();
        }catch(error)
        {
          return  res.status(400).json({ errors: error })
        }
}

module.exports=emailVerificate;