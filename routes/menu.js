const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  deleteMultipleMenuItems,
  importMenuItemsFromCSV,
  getCSVTemplate
} = require('../controllers/menuController');
const { auth, adminAuth } = require('../middleware/auth');
const { upload, csvUpload } = require('../middleware/upload');

// Define specific routes before generic ID routes
router.get('/', getAllMenuItems);
router.get('/csv-template', getCSVTemplate);
router.post('/import-csv', auth, adminAuth, csvUpload.single('csv'), importMenuItemsFromCSV);
router.post('/delete-multiple', auth, adminAuth, deleteMultipleMenuItems);

// Generic ID routes come after specific routes
router.get('/:id', getMenuItem);
router.post('/', auth, adminAuth, upload.single('image'), createMenuItem);
router.put('/:id', auth, adminAuth, upload.single('image'), updateMenuItem);
router.delete('/:id', auth, adminAuth, deleteMenuItem);

module.exports = router; 