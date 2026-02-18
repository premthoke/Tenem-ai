    const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json("User already exists");

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    user = await User.create({
      email,
      password: hashedPassword,
    });

    res.json("Signup successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    // create token
    const token = jwt.sign({ userId: user._id }, "secretkey", {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
});

module.exports = router;
