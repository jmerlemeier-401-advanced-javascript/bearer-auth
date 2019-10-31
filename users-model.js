'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, required: true, default: 'user', enum: ['user', 'editor', 'admin'] }//enum is list of option the role can be.
});

// encrypt...the pre hook
user.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); //10 salt value
  }
});

user.statics.quthenticatedBasic = function(authObject) {
  let query = {username: authObject.username};
  return this.findOne(query)
    .then(user => user.comparePassword(authObject.password))
    .catch(console.error);
}

user.methods.comparePassword = function() {
  return bcrypt.compare(this.password, password)
    .then(isValid => isValid ? this : null);
}

user.statics.authenticateToken = function(token) {
  //token is authenticated: verify that it is a JSON web token
  let parsedToken = jwt.verify(token, process.env.SECRET);
  return this.findOne({ _id: parsedToken.id});
  //this should return a user.
}

/**
 * Signing of token creates a new JWT
 */
user.methods.generateToken = function() {
  //token is created
  let tokenData = {
    id: this._id,
    role: this.role,
  }
  return jwt.sign(tokenData, process.env.SECRET);//sign with secret. Used to untokefy data
}

module.exports = mongoose.model('user', user);