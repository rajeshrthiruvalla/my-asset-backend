const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to configure Multer with a dynamic upload directory
const configureMulter = (uploadDir) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        // Use the provided uploadDir or fallback to 'uploads/'
        const dir = uploadDir || 'uploads/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true }); // recursive: true creates nested directories if needed
        }
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|pdf/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only images and PDFs are allowed!'), false);
      }
    },
  });
};

module.exports=configureMulter;