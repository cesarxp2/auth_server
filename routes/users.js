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

router.get('/register', (req, res) => {
 res.render('register')
});

router.get('/login', (req, res) => {
 db.run(`INSERT INTO users VALUES ("John Doe", "jdoe@gmail.com", "abcdefghijklomnopqrstuvwxyz", "password")`, (err) => {
  if (err)
   console.log('Welcome.')
 });
 res.render('login')
});

// ENDPOINT TO REGISTER AS A NEW USER
router.post('/register', (req, res) => {
 let name = req.body.name,
  email = req.body.email,
  username = req.body.username,
  password = req.body.password,
  passCheck = req.body.passCheck;

 req.checkBody('name', 'Name is required').notEmpty();
 req.checkBody('email', 'Email is required').notEmpty();
 req.checkBody('username', 'Username is required').notEmpty();
 req.checkBody('password', 'Password is required').notEmpty();
 req.checkBody('passCheck', 'Passwords do not match').equals(req.body.password);

 let errors = req.validationErrors();

 if (errors) {

  res.render('register', {errors: errors});

 } else {

  let newUser = {
   name,
   email,
   username,
   password
  };

  User.createUser(newUser, (err, user) => {
   db.run(`INSERT INTO users VALUES("${newUser.name}", "${newUser.email}", "${newUser.username}", "${newUser.password}")`, (err) => {
    if (err) {
     errors = [
      {
       param: 'usernameTaken',
       msg: 'Username has been taken',
       value: ''
      }
     ];
     return res.render('register', {errors: errors});
    } else {
     req.flash('success_msg', 'You are registered and can now log in!');

     res.redirect('login')
    }
   });
  });
 };
});

// STRATEGIES USED TO AUTHENTICATE USING PASSPORT
passport.use(new LocalStrategy((username, password, done) => {
 User.getUserByUsername(username, (err, user) => {
  if (err)
   return done(null, false, {message: 'Please try again'})
  if (!user) {
   return done(null, false, {message: 'Username does not exist'})
  }

  User.comparePassword(password, user.password, (err, isMatch) => {
   if (err)
    throw err
   if (isMatch) {
    return done(null, user);
   } else {
    return done(null, false, {message: 'Invalid password'})
   }
  })
 })
}));

passport.serializeUser(function(user, done) {
 var token = jwt.sign(user, app.get('superSecret'), {expiresIn: 60 *24});

 // return the information including token as JSON
 localStorage.setItem('token', token);
 // End
 done(null, user.username);
});

passport.deserializeUser(function(username, done) {
 User.getUserByUsername(username, (err, user) => {
  done(err, user);
 });
});

// ENDPOINT USED FOR LOGGING IN
router.post('/login', passport.authenticate('local', {
 successRedirect: '/',
 failureRedirect: '/users/login',
 failureFlash: 'Invalid username or password'
}), (req, res) => {
 res.redirect('/');
});

//ENDPOINT USED FOR LOGGIN OUT
router.get('/logout', (req, res) => {
 localStorage.removeItem('token');
 req.logout();
 res.redirect('login')
});

module.exports = router;
