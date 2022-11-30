const User = require("../models/User");
const jwt = require('jsonwebtoken')
require('dotenv').config();


// handle errors with mongoose
const handleErrors = (err) => {
  // console.log(err.message)
  let errors = { email: '', password: '' }

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is incorrect';
  }
  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect'
  }

  // duplicate email check
  if (err.message.includes('duplicate key error')) {
    errors.email = 'This email is already registered!';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors;
}

// create jwt token
const maxAge = 3 * 24 * 60 * 60; // in seconds
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge })
}

// Signup post
const signup_post = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password })
    const token = createToken(user._id); // create token and set into cookie
    res.cookie('access_token', token, { maxAge: maxAge * 1000, httpOnly: true, secure: true })
    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors })
  }
}


// Login post
const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('access_token', token, { maxAge: maxAge * 1000, httpOnly: true, secure: true }) // miliseconds
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

// logout
const logout_get = (req, res) => {
  res.cookie('access_token', '', { maxAge: 1 });
  res.redirect('/');
}


module.exports = { signup_post, login_post, logout_get }