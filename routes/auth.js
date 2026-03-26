const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // 3. Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // 4. Send Response
    res.json({ 
      token, 
      user: { name: user.name, email: user.email, tier: user.tier, joined: user.joined } 
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});


// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Identity already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { name: user.name, email: user.email, tier: user.tier, joined: user.joined } });
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;