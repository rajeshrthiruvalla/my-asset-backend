const bcrypt=require('bcrypt');
const User=require('../model/User')
const  register=async (req,res)=>{
    try {
            const { name, email, currency, password } = req.body;
            const existingUser=await User.findOne({email});
            if(existingUser)
            {
              return  res.status(400).json({message:"Email already exists"});
            }
            const saltRounds = 10; // Work factor for bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({ name, email, currency, password: hashedPassword });
            res.status(201).json({
            message: 'User registered successfully',
            user: { name, email, currency }
            });
    } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

module.exports={register}