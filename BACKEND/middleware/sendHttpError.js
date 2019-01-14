module.exports = function (req, res, next) {
  res.sendHttpError = function (_error) {
    res.status(_error.status);
    if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json(_error);
    } else {
      res.render('error', {error: _error});
    }
  };

  next();
};
