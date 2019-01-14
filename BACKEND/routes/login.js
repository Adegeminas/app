const User = require('../lib/mongoose').models.users;
const HttpError = require('../error').HttpError;
const AuthError = require('../error').AuthError;

exports.get = function (req, res) {
  res.render('login');
};

exports.post = function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  User.authorize(username, password, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      }
      return next(err);
    }
    req.session.user = user._id;
    res.send({});
  });
};
