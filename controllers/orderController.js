const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let { deliveryAddress, phoneNumber } = req.body;
    
    // If delivery details not provided, try to use saved profile details
    if (!deliveryAddress || !phoneNumber) {
      const user = await User.findById(req.user._id);
      if (!user.deliveryAddress || !user.phoneNumber) {
        return res.status(400).json({ 
          error: 'Please provide delivery details or update your profile with delivery information' 
        });
      }
      deliveryAddress = user.deliveryAddress;
      phoneNumber = user.phoneNumber;
    }
    
    // Calculate total amount and validate menu items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ error: `Menu item ${item.menuItem} not found` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ error: `Menu item ${menuItem.name} is not available` });
      }
      
      totalAmount += menuItem.price * item.quantity;
      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phoneNumber
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    // Populate the order data before sending the response
    const updatedOrder = await Order.findById(order._id)
      .populate('items.menuItem')
      .populate('user', 'name email');
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
}; 