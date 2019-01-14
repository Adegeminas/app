const log = require('../lib/log')(module);
const mongoose = require('mongoose');

const House = {
  address: {
    type: String,
    require: true,
    unique: true,
    default: 'NoAddress'
  },
  square: {
    type: Number,
    require: true,
    default: 1000
  },
  sameCounter: {
    type: Boolean,
    require: true,
    default: true
  },
  basicPeriod: {
    type: String,
    require: true,
    default: '10-15:05-16/10-16:05-17'
  },
  RC1: {
    type: String,
    require: true,
    default: 'ИРЦ'
  },
  RC2: {
    type: String,
    require: true,
    default: 'ИРЦ'
  },
  tarif: {
    type: Number,
    require: true,
    default: 1800
  },
  data: {
    type: [ {
      month: {
        type: String,
        require: true,
        default: '01-15'
      },
      savingWasntSold: {
        type: Boolean,
        require: true,
        default: true
      },
      shouldCount: {
        type: Boolean,
        require: true,
        default: true
      },
      company: {
        type: String,
        require: true,
        default: 'Сторм'
      },
      O: {
        type: Number,
        default: 0
      },
      P: {
        type: Number,
        default: 0
      },
      Q: {
        type: Number,
        default: 0
      },
      R: {
        type: Number,
        default: 0
      },
      tarif: {
        type: Number,
        require: true,
        default: 2000
      },
      basicMonths: {
        type: String,
        require: true,
        default: '---'
      }
    } ],
    require: true,
    default: []
  }
};

const options = {
  usePushEach: true
};

const housesSchema = mongoose.Schema(House, options);

housesSchema.statics.createHouse = function (parameters, callback) {
  const newHouse = new this(parameters);

  newHouse.save((err) => {
    if (err) {
      callback(false);
      log.error(err);
    } else {
      callback(true);
    }
  });
};

housesSchema.statics.readHouse = function (parameters, callback) {
  this.findOne({address: parameters.address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
    } else {
      callback(house);
    }
  });
};

housesSchema.statics.updateHouse = function (_address, request, callback) {
  this.findOne({address: _address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
      return;
    }
    Object.keys(request).forEach((key) => {
      house[key] = request[key];
    });
    house.save((_err) => {
      if (_err) {
        log.error(_err);
        callback(false);
        return;
      }
      callback(house);
    });
  });
};

housesSchema.statics.deleteHouse = function (_address, callback) {
  this.findOne({address: _address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
      return;
    }
    house.remove((_err) => {
      if (_err) {
        log.error(_err);
        callback(house);
        return;
      }
      callback(false);
    });
  });
};

housesSchema.statics.createPeriod = function (parameters, period, callback) {
  this.findOne({address: parameters.address}).exec((err, house) => {
    if (err || !house) {
      log.error(err, 'Непредвиденная ошибка');
      callback(false, 'Непредвиденная ошибка');
      return;
    }
    let flag = true;

    house.data.forEach((data) => {
      if (data.month === period.month) {
        flag = false;
      }
    });
    if (!flag) {
      callback(false, 'Период уже существует');
      return;
    }
    house.data.push(period);
    house.save((_err) => {
      if (_err) {
        log.error(_err);
        callback(false, 'Ошибка при сохранении периода');
        return;
      }
      callback(house);
    });
  });
};

housesSchema.statics.updatePeriod = function (_address, period, callback) {
  this.findOne({address: _address}).exec((err, house) => {
    if (err || !house) {
      log.error(err, 'Непредвиденная ошибка');
      callback(false, 'Непредвиденная ошибка');
      return;
    }

    house.data = house.data.filter(e => e.month !== period.month);
    house.data.push(period);

    house.save((_err) => {
      if (_err) {
        log.error(_err);
        callback(false, 'Ошибка при сохранении периода');
        return;
      }
      callback(house);
    });
  });
};

housesSchema.statics.findHouses = function (query, callback) {
  this.find(query, (err, houses) => {
    if (err || !houses.length) {
      log.error(err);
      callback(false);
    } else {
      callback(houses);
    }
  });
};

housesSchema.statics.deletePeriod = function (_address, period, callback) {
  this.findOne({address: _address}).exec((err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false, 'Дом не найден');
    } else {
      house.data = house.data.filter((elem) => {
        return elem.month !== period;
      });
      house.save((_err) => {
        if (_err) {
          log.error(_err);
          callback(false, 'Серверная ошибка');
          return;
        }
        callback(house, 'Успех');
      });
    }
  });
};

module.exports = housesSchema;
