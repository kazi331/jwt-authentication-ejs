const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Protected routes middlewares

const requireAuth = (req, res, next) => {
  console.log(req.url)
  // grab access token from the browser
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect('/login')
      } else {
        next();
      }
    })
  } else {
    res.redirect('/login')
  }
}

// Check Current user state

const checkUserState = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
}


module.exports = { requireAuth, checkUserState }