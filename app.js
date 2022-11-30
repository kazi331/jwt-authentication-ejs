const cookieParser = require('cookie-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');
const { checkUserState } = require('./middlewares/authMiddleware');
const router = require('./routes/authRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json())
app.use(express.static('public'));
require('dotenv').config()
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');


// database connection
const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.oxxl7li.mongodb.net`
mongoose.connect(dbURI, { dbName: 'blogusers' })
  .then(() => app.listen(PORT, () => console.log('DB Connected!')))
  .catch(err => console.log(err))


// Routes
app.get('*', checkUserState)
app.use(router)

