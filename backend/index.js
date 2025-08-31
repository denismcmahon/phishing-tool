const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const campaignRoutes = require('./routes/campaigns');
const resultRoutes = require('./routes/results');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/results', resultRoutes);

app.get('/', (req, res) => {
  res.send('Phishing Tool API running');
});

// Mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 4000, () =>
      console.log(
        `Server running on http://localhost:${process.env.PORT || 4000}`
      )
    );
  })
  .catch((err) => console.error('Mongo error:', err));
