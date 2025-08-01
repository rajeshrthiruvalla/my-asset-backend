const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");
const User=require('../model/User')
const saltRounds = 10; 

const generateToken=(user)=>{
     
           return jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                "secretkeyappearshere",
                { expiresIn: "1h" }
            );
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

            const user = new User({ name, email, currency, password: hashedPassword });
            await user.save();
            const token=generateToken(user);
            res.status(201).json({
            message: 'User registered successfully',
            user: { name, email, currency, token }
            });
    } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

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
module.exports={register,login,updateProfile}