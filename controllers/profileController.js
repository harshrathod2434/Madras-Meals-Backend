const User = require('../models/User');
const connect = require('../config/mongoconnect');

const updateProfile = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();

    const { deliveryAddress, phoneNumber } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (deliveryAddress) user.deliveryAddress = deliveryAddress;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        deliveryAddress: user.deliveryAddress,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  updateProfile
}; 