// routes/authRoutes.js
const express = require("express");
const User = require("../models/User");

const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// routes/authRoutes.js

router.get("/users", async (req, res) => {
  const users = await User.findAll();  // Adjust query to exclude the current user as needed
  res.json(users);
});


module.exports = router;
