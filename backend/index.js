const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Phishing Tool API running");
});

// Mongo connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 4000}`)
    );
  })
  .catch((err) => console.error("Mongo error:", err));
