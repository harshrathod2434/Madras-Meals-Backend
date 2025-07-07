const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

router.put('/', auth, updateProfile);

module.exports = router; 