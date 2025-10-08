const User=require('../model/User')

const emailVerificate=async (req,res,next)=>{
    try{  
        const id= req.token.userId;
        const user = await User.findById(id);
        if(!user.isVerified)
        {
            return res.status(401)
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
          return  res.status(401).json({ errors: error,message: "Email Verification Error" })
        }
}

module.exports=emailVerificate;