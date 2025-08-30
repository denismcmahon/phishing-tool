const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Campaign = require('../models/Campaign');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB, seeding data...');

    // clear old data
    await User.deleteMany();
    await Campaign.deleteMany();

    // create users
    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@corp.com', department: 'Finance' },
      { name: 'Bob', email: 'bob@corp.com', department: 'HR' },
      { name: 'Charlie', email: 'charlie@corp.com', department: 'IT' },
      { name: 'Dana', email: 'dana@corp.com', department: 'Marketing' },
    ]);

    console.log(`Seeded ${users.length} users`);

    // create a sample campaign
    const campaign = new Campaign({
      name: 'Invoice Scam Test',
      type: 'invoice',
      users: [users[0]._id, users[1]._id],
      status: 'running',
      emails: users.slice(0, 2).map((u) => ({ userId: u._id, status: 'sent' })),
    });

    await campaign.save();

    console.log('Seeded campaign:', campaign.name);

    mongoose.connection.close();
    console.log('Seeding complete ');
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
};

seedData();
