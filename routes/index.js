const express = require('express'),
 router = express.Router(),
 User = require('../database/encryptUser'),
 sqlite3 = require('sqlite3').verbose(),
 db = new sqlite3.Database("././database/minolta.db"),
 passport = require('passport'),
 jwt = require('jsonwebtoken'),
 localStorage = require('localStorage'),
 app = require('../server.js'),
 LocalStrategy = require('passport-local').Strategy;

router.get('/', ensureAuthentication, (req, res) => {
 let token = localStorage.getItem('token'),
  objInfo = {
   success: true,
   message: 'Here is the token passed in through the response',
   token
  };

 jwt.verify(token, app.get('superSecret'), function(err, decoded) {
  if (err) {
   let errors = [
    {
     param: 'notVerified',
     msg: 'Please try logging in',
     value: ''
    }
   ];
   return res.render('register', {errors: errors});
  } else {
   req.decoded = decoded;
   res.render('index', {objInfo})
  }
 })
});

function ensureAuthentication(req, res, next) {
 if (req.isAuthenticated()) {
  return next();
 } else {
  res.redirect('/users/login');
 }
};

router.get('/viewjwt', (req, res) => {
 let token = localStorage.getItem('token');
 console.log('THIS IS YOUR TOKEN', token);
 res.end();
});

router.get('/viewdb', (req, res) => {
 let viewDBQuery = `SELECT * FROM users`;
 db.each(viewDBQuery, (err, allUsers) => {
  console.log('THIS IS THE DATABASE INFO', allUsers);
 });
 res.end();
});

module.exports = router;
