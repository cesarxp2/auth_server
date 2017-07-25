const bcrypt = require('bcryptjs'),
 sqlite3 = require('sqlite3').verbose(),
 db = new sqlite3.Database("././database/minolta.db");

module.exports.createUser = (newUser, cb) => {
 bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash(newUser.password, salt, function(err, hash) {
   newUser.password = hash;
   cb(newUser);
  });
 });
};

module.exports.getUserByUsername = (username, cb) => {
 let query = `SELECT username, password FROM users WHERE username = "${username}"`;
 db.get(query, cb);
}

module.exports.checkIfUnique = (username, cb) => {
 console.log('checking if unique...')
 let searchQuery = `SELECT username FROM users WHERE username = "${username}"`;
 db.each(searchQuery, cb)
}

module.exports.comparePassword = (password, hash, cb) => {
 bcrypt.compare(password, hash, (err, isMatch) => {
  if (err)
   throw err;
  cb(null, isMatch);
 });
}
