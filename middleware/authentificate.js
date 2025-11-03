const jwt = require("jsonwebtoken");

const authentificate=(req,res,next)=>{
    try{
            const token =
            req.headers
                .authorization.split(' ')[1];
        if (!token) {
           return res.status(200)
                .json(
                    {
                        success: false,
                        message: "Error!Token was not provided."
                    }
                );
        }
        //Decoding the token
        const decodedToken =jwt.verify(token, "secretkeyappearshere");
        req.token=decodedToken;
        next();
        }catch(error)
        {
          return  res.status(401).json({ message:'Session Expired',errors: error })
        }
}

module.exports=authentificate;