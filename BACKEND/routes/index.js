// const checkAuth = require('../middleware/checkAuth');

module.exports = function (app) {
  app.get('/canvas', require('./canvas').get);
  app.get('/webgl', require('./webgl').get);
  // app.get('/', require('./frontpage').get);
  // app.get('/login', require('./login').get);
  // app.post('/login', require('./login').post);
  // app.post('/logout', require('./logout').post);
  // app.get('/entries', checkAuth, require('./entries-react').get);
  // app.get('/reports', checkAuth, require('./reports-react').get);
};
