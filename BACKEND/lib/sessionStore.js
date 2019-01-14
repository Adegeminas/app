const mongoose = require('./mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({
  url: 'mongodb://' + mongoose.connection.host + ':' + mongoose.connection.port + '/' + mongoose.connection.name
});

module.exports = sessionStore;
