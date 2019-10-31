'use strict';

//have one user model and one middleware for auth. 
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/class13', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const user = require('./users-model');
const authMiddleware = require('./auth-middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//=========
app.post('/signup', (req, res, next) => {
  let newUser = new User(req.body);
  newUser.save()
    .then(user => {
     res.cookie('auth', token);
     res.send(token);
    }).catch(next);
})

app.post('/signin', authMiddleware, (req, res) => {
  res.cookie('auth', req.token);
  res.send(req.token);
})

app.get('/unprotected', (req, res) => {
  res.send('You are unprotected');
});

app.get('/protected', authMiddleware, (req, res) => {
  res.send('You have a valid token!');
});

app.listen(3000, () => {
  console.log('App is running');
});