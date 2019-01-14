const Solian = require('./Solian.js');
const Field = require('./Field.js');

module.exports = class Universe {
  constructor() {
    this.MAX_RANGE = 20;

    this.map = [];
    for (let i = 0; i < this.MAX_RANGE; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.MAX_RANGE; j++) {
        this.map[i][j] = new Field(i, j);
      }
    }

    this.solians = [
      new Solian(1, 1, 'a'),
      new Solian(1, 9, 'b'),
      new Solian(3, 9, 'c'),
      new Solian(6, 3, 'd'),
      new Solian(9, 0, 'e')
    ];

    this.map[1][1].setObject(this.getObject('a'));
    this.map[1][9].setObject(this.getObject('b'));
    this.map[3][9].setObject(this.getObject('c'));
    this.map[6][3].setObject(this.getObject('d'));
    this.map[9][0].setObject(this.getObject('e'));
  }

  getField(x, y) {
    return this.map[x][y];
  }

  getObject(id) {
    return this.solians.filter(s => s.id === id)[0] || null;
  }

  moveOneStep(id, x, y) {
    return new Promise(function (resolve, reject) {
      const obj = this.getObject(id);

      if (!obj) reject('no object');
      if (obj.state !== 'standing') return reject('is moving');
      if (Math.abs(x) + Math.abs(y) !== 1) return reject('not simple');
      if (obj.x + x < 0 || obj.x + x >= this.MAX_RANGE) return reject('out of range');
      if (obj.y + y < 0 || obj.y + y >= this.MAX_RANGE) return reject('out of range');
      if (this.getField(obj.x + x, obj.y + y).object) return reject('not empty');

      obj.state = 'moving';

      setTimeout(function () {
        if (this.getField(obj.x + x, obj.y + y).object) {
          obj.state = 'standing';
          return reject('not empty');
        }
        this.getField(obj.x, obj.y).setObject(null);

        obj.x += x;
        obj.y += y;
        obj.state = 'standing';

        this.getField(obj.x, obj.y).setObject(obj);
        resolve(obj);
      }.bind(this), obj.speed);
    }.bind(this));
  }

  moveObject(id, x, y) {
    if (x === 0 && y === 0) return;

    if (x !== 0) {
      if (x > 0) {
        this.moveOneStep(id, 1, 0)
          .then(obj => {
            this.moveObject(obj.id, x - 1, y);
          })
          .catch(console.error);
      } else {
        this.moveOneStep(id, -1, 0)
          .then(obj => {
            this.moveObject(obj.id, x + 1, y);
          })
          .catch(console.error);
      }
    } else if (y > 0) {
      this.moveOneStep(id, 0, 1)
        .then(obj => {
          this.moveObject(obj.id, x, y - 1);
        })
        .catch(console.error);
    } else {
      this.moveOneStep(id, 0, -1)
        .then(obj => {
          this.moveObject(obj.id, x, y + 1);
        })
        .catch(console.error);
    }
  }

  start() {
    // ..
  }
};
