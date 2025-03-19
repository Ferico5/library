const UserModel = require('../models/UserModel.js');

const createUser = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ msg: 'Email already exists, try another!' });
    }

    const newUser = new UserModel(req.body);
    await newUser.save();

    res.status(201).json({ msg: 'User created!' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email, password });

    if (user) {
      res.status(200).json({ msg: 'Login successful', user });
    } else {
      res.status(400).json({ msg: 'Invalid email or password!' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createUser, loginUser };
