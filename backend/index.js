const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const trackingRoutes = require('./routes/tracking');
const authRoutes = require('./routes/auth');

const { authMiddleware, requireRole } = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', authMiddleware, requireRole('admin'), require('./routes/campaigns'));
app.use('/api/templates', authMiddleware, requireRole('admin'), require('./routes/templates'));
app.use('/api/users', authMiddleware, requireRole('admin'), require('./routes/users'));
app.use('/api/track', trackingRoutes);

app.get('/', (req, res) => {
  res.send('Phishing Tool API running');
});

// Mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 4000}`)
    );
  })
  .catch((err) => console.error('Mongo error:', err));
