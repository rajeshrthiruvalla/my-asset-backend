const jwt = require("jsonwebtoken");

const authenticate=(req,res,next)=>{
    try{
            const token =
            req.headers
                .authorization.split(' ')[1];
        if (!token) {
            res.status(200)
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
          return  res.status(400).json({ errors: error })
        }
}

module.exports=authenticate;