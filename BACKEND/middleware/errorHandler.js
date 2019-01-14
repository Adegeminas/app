const HttpError = require('../error').HttpError;
const errorHandler = require('errorhandler');

module.exports = function (err, req, res, next) {
  if (typeof err === 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    errorHandler()(err, req, res, next);
  }
};


// module.exports = function (err, req, res, next) {
//   if (typeof err === 'number') {
//     err = new HttpError(err);
//   }
//   if (err instanceof HttpError) {
//     res.sendHttpError(err);
//   } else if (app.get('env') === 'development') {
//     errorHandler()(err, req, res, next);
//   } else {
//     log.error(err);
//     err = new HttpError(500);
//     res.sendHttpError(err);
//   }
// }
