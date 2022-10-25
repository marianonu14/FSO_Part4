const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.post('/', async (req, res) => {
  try {
    const body = req.body;

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
