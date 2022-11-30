const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');




// create user schema
const userSchema = new Schema({
  name: {
    type: String,
    minLength: [4, "Minimum name length is 4 characters"],
    required: [true, "Please insert name."]
  },
  email: {
    type: String,
    required: [true, 'Please insert email'],
    unique: [true, 'This email is already registered!'],
    lowercase: true,
    validate: [isEmail, 'Please insert a valid email']
  },
  password: {
    type: String,
    required: [true, "Please insert password!"],
    minLength: [6, "Minimum password length is 6 characters"]
  }
})


// encrypt password before saving into database - with bcrypt
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
  } catch (err) {
    console.log(err)
  }
  next();
})


// custom static login method for mongoose
userSchema.statics.login = async function (email, password) {
  const user = await User.findOne({ email });
  // check for user
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user;
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')

}


const User = model('user', userSchema)

module.exports = User;

