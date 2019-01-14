const log = require('../lib/log')(module);
const mongoose = require('mongoose');
const crypto = require('crypto');
const async = require('async');
const AuthError = require('../error').AuthError;

const User = {
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
};

const userSchema = mongoose.Schema(User);

userSchema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.statics.authorize = function (_username, _password, _callback) {
  const _userSchema = this;

  async.waterfall([
    function (callback) {
      _userSchema.findOne({username: _username}, callback);
    },
    function (user, callback) {
      if (user) {
        if (user.checkPassword(_password)) {
          log.info(user.id + ' connected ' + new Date());
          callback(null, user);
        } else {
          callback(new AuthError('Пароль неверен'));
        }
      } else {
        const newUser = new _userSchema({username: _username, password: _password, salt: Math.random() + ''});

        newUser.save(function (err) {
          if (err) return callback(err);
          log.info(newUser.id + ' connected ' + new Date());
          callback(null, newUser);
        });
      }
    }
  ], _callback);
};


module.exports = userSchema;
