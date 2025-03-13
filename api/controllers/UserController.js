import UserModel from '../models/UserModel.js';

export const createUser = async (req, res) => {
  try {
    const existingEmail = await UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        msg: 'Email is already exist, please try another email!',
      });
    }

    await UserModel.create(req.body);
    res.status(201).json({
      msg: 'User created!',
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await UserModel.findOne({
      where: {
        email: email,
        password: password,
      },
    });

    if (response) {
      res.status(200).json({
        msg: 'Login successful',
        response: response,
      });
    } else {
      res.status(400).json({
        msg: 'Invalid email or password!',
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
