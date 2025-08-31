const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Template = require('../models/Template');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB, seeding data...');

    // clear old data
    await User.deleteMany();
    await Campaign.deleteMany();
    await Template.deleteMany();
    console.log('Cleared existing collections');

    // create users
    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@corp.com', department: 'Finance' },
      { name: 'Bob', email: 'bob@corp.com', department: 'HR' },
      { name: 'Charlie', email: 'charlie@corp.com', department: 'IT' },
      { name: 'Dana', email: 'dana@corp.com', department: 'Marketing' },
    ]);
    console.log(`✅ Seeded ${users.length} users`);

    // create email templates first
    const templates = await Template.insertMany([
      {
        name: 'Invoice Scam',
        subject: 'Urgent: Outstanding Invoice Payment Required',
        bodyHtml: `
          <p>Dear User,</p>
          <p>Our records indicate that you have an outstanding invoice that requires immediate attention.</p>
          <p><a href="http://phishing-link.com">Click here</a> to review and settle your balance.</p>
          <p>Thank you,</p>
          <p>Finance Department</p>
        `,
        bodyText:
          'Dear User,\n\nOur records indicate you have an outstanding invoice. Visit http://phishing-link.com to review and settle your balance.\n\nFinance Department',
      },
      {
        name: 'Password Reset',
        subject: 'Password Reset Request',
        bodyHtml: `
          <p>Hello,</p>
          <p>We received a request to reset your account password. If this was you, please <a href="http://phishing-link.com/reset">reset your password here</a>.</p>
          <p>If not, please ignore this email.</p>
        `,
        bodyText:
          'Hello,\n\nWe received a request to reset your password. Reset at http://phishing-link.com/reset\n\nIf not, ignore this email.',
      },
      {
        name: 'HR Alert',
        subject: 'Important HR Policy Update',
        bodyHtml: `
          <p>Dear Employee,</p>
          <p>Our HR department has released a new policy update. Please <a href="http://phishing-link.com/hr">review the changes here</a>.</p>
          <p>Best,</p>
          <p>HR Department</p>
        `,
        bodyText:
          'Dear Employee,\n\nHR has released a new policy update. Review here: http://phishing-link.com/hr\n\nHR Department',
      },
    ]);
    console.log(`✅ Seeded ${templates.length} templates`);

    // create a sample campaign and link to first template
    const campaign = new Campaign({
      name: 'Invoice Scam Test',
      type: 'invoice',
      template: templates[0]._id,
      users: [users[0]._id, users[1]._id],
      status: 'running',
      emails: users.slice(0, 2).map((u) => ({ userId: u._id, status: 'sent' })),
    });

    await campaign.save();
    console.log(
      `✅ Seeded campaign: ${campaign.name} (with template: ${templates[0].name})`
    );

    mongoose.connection.close();
    console.log('🎉 Seeding complete');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    mongoose.connection.close();
  }
};

seedData();
