const express = require('express');
const { signup_post, login_post, logout_get } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// basic get routes
router.get('/', (req, res) => res.render('home'))
router.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))

// auth get routes
router.get('/signup', (req, res) => res.render('signup'))
router.get('/login', (req, res) => res.render('login'))
router.get('/logout', logout_get)

// auth post routes
router.post('/login', login_post)
router.post('/signup', signup_post);


module.exports = router;