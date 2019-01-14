const log = require('./log')(module);
const mongoose = require('mongoose');
const config = require('../config');
const userSchema = require('../models/userSchema');
const housesSchema = require('../models/housesSchema');
const catalogueSchema = require('../models/catalogueSchema');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || config.get('mongoose:uri'), config.get('mongoose:options'), () => {
  log.info('Connection succeed');
});

mongoose.model('users', userSchema);
mongoose.model('houses', housesSchema);
mongoose.model('catalogue', catalogueSchema);

module.exports = mongoose;
