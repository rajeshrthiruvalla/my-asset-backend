const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");
const transporter=require('../config/mail');
const crypto = require('crypto');
const User=require('../model/User')
const saltRounds = 10; 

const generateToken=(user)=>{
     
           return jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                "secretkeyappearshere",
                // { expiresIn: "1h" }
            );
}
const sentVerificationMail=async (verificationToken,email)=>{
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
           
            const mailOptions = {
                from: `"My Asset" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Verify Your Email Address',
                html: `
                  <h2>Email Verification</h2>
                  <p>Please verify your email by clicking the link below:</p>
                  <a href="${verificationUrl}">Verify Email</a>
                  <p>This link will expire in 1 hour.</p>
                `
              };

              await transporter.sendMail(mailOptions);
}
const  register=async (req,res)=>{
    try {
            const { name, email, currency, password } = req.body;
            const existingUser=await User.findOne({email});
            if(existingUser)
            {
              return  res.status(400).json({message:"Email already exists"});
            }
            
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenExpiry = Date.now() + 3600000; // 1 hour expiry

            const user = new User({ name,
                                    email, 
                                    currency, 
                                    password: hashedPassword,
                                    verificationToken,
                                    verificationTokenExpiry,
                                    isVerified: false 
                                  });
            await user.save();
            const token=generateToken(user);

            await sentVerificationMail(verificationToken,email);

            res.status(201).json({
            message: 'User registered successfully',
            user: { name, email, currency, token }
            });
    } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}
const verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.query;
    const user = await User.findOne({
      email,
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
         const user = await User.findOne({email});
         if(user.isVerified)
         {
          return res.render('VerifiedSuccess')
         }
       return  res.render('VerificationFailed', {
            message: "We couldn't verify your email. The link may have expired or is invalid.",
            secondary:"Retry login, new verification link generate"
        })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

     res.render('VerifiedSuccess')
  } catch (error) {
    console.error('Email verification error:', error);
      return  res.render('VerificationFailed', {
            message: "We couldn't verify your email. Server error during email verification.",
            secondary:"Retry after some time"
        })
  }
};
const login=async (req,res)=>{
  try {
      const { email, password } = req.body;
      const user=await User.findOne({email});
        if(!user)
        {
          return  res.status(400).json({message:"User Not Registered"});
        }

        if(!bcrypt.compare(password, user.password))
        {
          return  res.status(400).json({message:"Incorrect Password"});
        }
        if(!user.isVerified)
        {
           if((user.verificationTokenExpiry<Date.now())||(!user.verificationTokenExpiry))
           {
            user.verificationToken=crypto.randomBytes(32).toString('hex');
            user.verificationTokenExpiry=Date.now() + 3600000;
            await user.save();
           }
            await sentVerificationMail(user.verificationToken,email);
            return  res.status(400).json({message:"Verification Link Sent To Your Mobile. Please verify"});
        }
        const token=generateToken(user);
        res.status(201).json({
        message: 'Login successfully',
        user: { name:user.name, email:user.email, currency:user.currency, token }
        });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

const forgotPassword=async (req,res)=>{
   const {email}=req.body;
   try{
      const user=await User.findOne({email});
      if(!user)
      {
        return  res.status(400).json({message:"User Not Registered"});
      } 
      user.verificationToken=crypto.randomBytes(32).toString('hex');
      user.verificationTokenExpiry=Date.now() + 3600000;
      user.isVerified=false;
      await user.save();
      await sentVerificationMail(user.verificationToken,email);
      const token=generateToken(user);
      res.status(201).json({
        message: 'Verification Mail Sent',
        user: { name:user.name, email:user.email, currency:user.currency, token }
        });
   } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
const changePassword=async (req,res)=>{
  const id= req.token.userId;
  const {password}=req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user=await User.findById(id);
  user.password=hashedPassword;
  await user.save();
  return res.status(201).json({"message":"Updated Successfully"});
}
const updateProfile=async (req,res)=>{
  const id= req.token.userId;
  const {name,currency}=req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: {name,currency} }, // Fields to update
      { new: true, runValidators: true } // Options: return updated doc, validate data
    );
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return res.status(201).json({"message":"Updated Successfully",
                                 "data":{name:updatedUser.name,
                                         currency:updatedUser.currency}});
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
module.exports={register,verifyEmail,login,updateProfile,forgotPassword,changePassword}