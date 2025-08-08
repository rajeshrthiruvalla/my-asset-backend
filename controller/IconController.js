const Icon=require('../model/Icon')
const mongoose = require('mongoose');

const storeIcon=async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const { name } = req.body; // Access the 'name' field from the form-data
      if (!name) {
        return res.status(400).json({ message: 'Name field is required' });
      }
      const userId= req.token.userId;
      const userObjectId= new mongoose.Types.ObjectId(userId);
      const query = {
                name, // Filter by name: "wallet"
                $or: [
                    { userId: userObjectId }, // Matches current user's ID
                    { userId: { $exists: false } } // Matches icons with no userId
                ]
            };
      const iconCheck=Icon.find(query);
      if(iconCheck)
      {
         return res.status(400).json({ message: 'Duplicate Name' });
      }
      const path = req.file.path.replace(/\\/g, '/');

      const icon=new Icon({name,path,userId});
      await icon.save();
      res.json({
        message: `File saved successfully`,
        data:{name,path}
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

const iconList=async (req,res)=>{
    const userId= req.token.userId;
    const userObjectId= new mongoose.Types.ObjectId(userId);
    const query = {
                        $or: [
                            { userId: userObjectId }, 
                            { userId: { $exists: false } } 
                        ]
                    };
    const icons=await Icon.find(query);
    res.json({
            message: `Icons list`,
            data:icons
        });
}

const updateIcon=async (req, res) => {
    try {

      const { name,id } = req.body; // Access the 'name' field from the form-data
      if (!name) {
        return res.status(400).json({ message: 'Name field is required' });
      }      
      if (!id) {
        return res.status(400).json({ message: 'Id field is required' });
      }
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid Icon ID format' });
      }
      const userId= req.token.userId;
     const iconNameCheck = await Icon.findOne({
            name,
            _id: { $ne: id }, // Exclude the current icon
            $or: [
                { userId }, // Matches current user's ID
                { userId: { $exists: false } } // Matches icons with no userId
            ]
        });
    if (iconNameCheck) {
            return res.status(400).json({
                message: 'An icon with this name already exists for this user or as a shared icon'
            });
    }
      const icon=await Icon.findById(id);
      if(!icon)
      {
         return res.status(400).json({ message: 'Invalid Id' });
      }
      if (icon.userId && icon.userId.toString() !== userId) {
            return res.status(403).json({ message: "You don't have permission to update this icon" });
        }
      if(req.file)
      {
        icon.path = req.file.path.replace(/\\/g, '/');
      }
      icon.name=name;

      await icon.save();
      res.json({
        message: `Updated successfully`,
        data:icon
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  }

module.exports={storeIcon,iconList,updateIcon}