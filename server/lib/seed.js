const mongoose = require('mongoose');

const seedDatabase = async () => {
  try {
    const User = mongoose.model('user');
    const adminUser = await User.create({
      email: 'avilqu@gmail.com',
      password: 'almagro',
      name: 'Adrien',
      role: 'admin',
      verified: true
    });
    const regularUser = await User.create({
      email: 'marvin@malinator.com',
      password: 'almagro',
      name: 'Marvin',
      verified: true
    });
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase }; 