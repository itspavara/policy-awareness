import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  //check user information | next is middleware(callback function) that use in expressjs
  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));//next use for passe error object to passed to erroHandler middleware
  }

  //hase password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  //make user 
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  //error handling 
  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    // separate password from the validuser
    const { password: pass, ...rest } = validUser._doc;

    res.status(200).cookie('access_token', token, {
        httpOnly: true,
      }).json(rest);
  } catch (error) {
    next(error);
  }
};


