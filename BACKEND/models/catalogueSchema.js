const log = require('../lib/log')(module);
const mongoose = require('mongoose');

const options = {
  usePushEach: true
};

const Catalogue = {
  streets: {
    type: [
      String
    ]
  },
  companies: {
    type: [
      String
    ]
  }
};

const catalogueSchema = mongoose.Schema(Catalogue, options);

catalogueSchema.statics.get = function (callback) {
  this.findOne((err, catalogue) => {
    if (!err && !catalogue) {
      const emptyCatalogue = new this();

      emptyCatalogue.save();
      callback(false);
      return;
    }
    if (err) {
      callback(false);
    } else {
      callback(catalogue);
    }
  });
};

catalogueSchema.statics.addNewStreet = function (streetName) {
  this.findOne((err, catalogue) => {
    if (err) {
      log.error(err);
    } else {
      let flag = true;

      catalogue.streets.forEach((street) => {
        if (street === streetName) {
          flag = false;
        }
      });
      if (flag) catalogue.streets.push(streetName);
      catalogue.save();
    }
  });
};

catalogueSchema.statics.addCompany = function (companyName) {
  this.findOne((err, catalogue) => {
    if (err) {
      log.error(err);
    } else {
      let flag = true;

      catalogue.companies.forEach((company) => {
        if (company === companyName) {
          flag = false;
        }
      });
      if (flag) catalogue.companies.push(companyName);
      catalogue.save();
    }
  });
};

module.exports = catalogueSchema;
