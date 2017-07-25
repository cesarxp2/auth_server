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
 res.render('index')
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
});

router.get('/viewdb', (req, res) => {
 let viewDBQuery = `SELECT * FROM users`;
 db.each(viewDBQuery, (err, allUsers) => {
  console.log('THIS IS THE DATABASE INFO', allUsers);
 });
});

module.exports = router;
