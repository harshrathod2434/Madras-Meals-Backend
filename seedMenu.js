require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const menuItems = [
  {
    name: "Masala Dosa",
    price: 120,
    description: "Crispy dosa stuffed with spicy mashed potatoes.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/masala-dosa.jpg",
    category: "main course"
  },
  {
    name: "Plain Dosa",
    price: 100,
    description: "Traditional South Indian rice crepe served with chutneys.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/plain-dosa.jpg",
    category: "main course"
  },
  {
    name: "Idli",
    price: 80,
    description: "Steamed rice cakes, light and fluffy, served with sambar and chutney.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/idli.jpg",
    category: "appetizer"
  },
  {
    name: "Medu Vada",
    price: 90,
    description: "Crispy fried lentil donuts, perfect with coconut chutney.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/medu-vada.jpg",
    category: "appetizer"
  },
  {
    name: "Upma",
    price: 85,
    description: "Savory semolina porridge with vegetables and mustard seeds.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/upma.jpg",
    category: "main course"
  },
  {
    name: "Pongal",
    price: 90,
    description: "Comforting rice and lentil dish, seasoned with pepper and ghee.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/pongal.jpg",
    category: "main course"
  },
  {
    name: "Sambar",
    price: 70,
    description: "Spicy and tangy lentil-based vegetable stew.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/sambar.jpg",
    category: "main course"
  },
  {
    name: "Rasam Rice",
    price: 60,
    description: "Hot and peppery tamarind soup served over rice.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/rasam-rice.jpg",
    category: "main course"
  },
  {
    name: "Curd Rice",
    price: 70,
    description: "Cool and refreshing yogurt rice with mustard tempering.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/curd-rice.jpg",
    category: "main course"
  },
  {
    name: "Filter Coffee",
    price: 40,
    description: "Strong and aromatic South Indian filter coffee.",
    image: "https://res.cloudinary.com/dyzvzef89/image/upload/v1744968420/madras-meals/filter-coffee.jpg",
    category: "beverage"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert new menu items
    const insertedItems = await MenuItem.insertMany(menuItems);
    console.log(`Successfully seeded ${insertedItems.length} menu items`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 