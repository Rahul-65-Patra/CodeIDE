const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/codeIDE');   // codeIDE is a database name

let userScheam = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now()
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
})

module.exports = mongoose.model('User',userScheam);  // User is the name of the collection

