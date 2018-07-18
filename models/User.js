const mongoose = require('mongoose'); // standard module for  MongoDB
const crypto = require('crypto'); // crypto module for node.js for e.g. creating hashes
const CONFIG = require('../config');

mongoose.Promise = Promise; // Ask Mongoose to use standard Promises
mongoose.set('debug', true);  // Ask Mongoose to log DB request to console
mongoose.connect(CONFIG.dbName); // Connect to local database
mongoose.connection.on('error', console.error);

const userSchema = new mongoose.Schema({
  displayName: String,
  email: {
    type: String,
    required: 'e-mail is required',
    unique: 'this e-mail already exist'
  },
  passwordHash: String,
  salt: String,
}, { timestamps: true });

userSchema
  .virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
  return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);