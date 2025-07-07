const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const os = require('os');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage with cloudinary for images
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'madras-meals',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

// Create a local disk storage for CSV files
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Use system temp directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'csv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  // Accept only images
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// File filter for CSV files
const csvFileFilter = (req, file, cb) => {
  // Accept only CSV files
  const filetypes = /csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel';

  if ((mimetype || extname)) {
    return cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed!'));
  }
};

// Create multer upload instances
const upload = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limit to 5MB
  },
  fileFilter: imageFileFilter
});

const csvUpload = multer({
  storage: csvStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // limit to 2MB
  },
  fileFilter: csvFileFilter
});

// Export a single object with both upload configurations
module.exports = { 
  upload, 
  csvUpload,
  cloudinary 
}; 