const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: false,
    default: 'main course',
    enum: ['appetizer', 'main course', 'dessert', 'beverage']
  },
  image: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'menuitems'
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; 