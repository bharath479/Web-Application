const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Sample schema
const User = mongoose.model("User", {
  name: String,
  email: String
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Web App Running 🚀" });
});

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
