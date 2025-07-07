const User = require('../models/User');
const Order = require('../models/Order');
const connect = require('../config/mongoconnect');

// Get all customers (users with role 'user')
const getAllCustomers = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();
    
    // Fetch only users with role 'user' and exclude password field
    const customers = await User.find({ role: 'user' }).select('-password');
    
    // Get order count for each customer
    const customersWithOrderCount = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ user: customer._id });
        const customerObj = customer.toObject();
        
        // Ensure phone is properly set (even if it's empty string or null)
        return {
          ...customerObj,
          phone: customerObj.phone || null,
          orderCount
        };
      })
    );
    
    res.json(customersWithOrderCount);
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Get all orders for a specific customer
const getCustomerOrders = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();
    
    const { customerId } = req.params;
    
    // Verify the customer exists and has role 'user'
    const customer = await User.findOne({ _id: customerId, role: 'user' });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Get all orders for this customer with populated menu items
    const orders = await Order.find({ user: customerId })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error getting customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
};

// Get customer statistics
const getCustomerStats = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();
    
    // Count total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });
    
    // Get customers with the most orders (top 5)
    const topCustomers = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' } } },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
      { $unwind: '$userInfo' },
      { $project: { 
          _id: 1, 
          orderCount: 1, 
          totalSpent: 1, 
          name: '$userInfo.name', 
          email: '$userInfo.email' 
        } 
      }
    ]);
    
    // Get new customers in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newCustomers = await User.countDocuments({ 
      role: 'user',
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      totalCustomers,
      topCustomers,
      newCustomers
    });
  } catch (error) {
    console.error('Error getting customer statistics:', error);
    res.status(500).json({ error: 'Failed to fetch customer statistics' });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerOrders,
  getCustomerStats
}; 