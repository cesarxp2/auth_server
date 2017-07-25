const express = require('express'),
 passport = require('passport'),
 bodyParser = require('body-parser'),
 path = require('path'),
 flash = require('connect-flash'),
 hbs = require('express-handlebars'),
 session = require('express-session'),
 expValidator = require('express-validator'),
 passLocal = require('passport-local').Strategy,
 port = process.env.PORT || 3000,
 cookieParser = require('cookie-parser'),
 jwt = require('jsonwebtoken'),
 app = module.exports = express();

let routes = require('./routes/index'),
 users = require('./routes/users');

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());
app.use(flash());

app.set('superSecret', 'secret');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'secret', saveUninitialized: true, resave: true}));
// Passport
app.use(passport.initialize());
app.use(passport.session());

//Code from express-validator Github
app.use(expValidator({
 errorFormatter: function(param, msg, value) {
  var namespace = param.split('.'),
   root = namespace.shift(),
   formParam = root;

  while (namespace.length) {
   formParam += '[' + namespace.shift() + ']';
  }
  return {param: formParam, msg: msg, value: value};
 }
}));

// Global Variables
app.use((req, res, next) => {
 res.locals.success_msg = req.flash('success_msg');
 res.locals.error_msg = req.flash('error_msg');
 res.locals.error = req.flash('error'); // For passport errors
 next();
})

app.use('/', routes);
app.use('/users', users);

app.listen(port, () => {
 console.log(`Listening on port ${port}!`)
})
