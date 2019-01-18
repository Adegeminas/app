const Solian = require('./Solian.js');
const Field = require('./Field.js');

module.exports = class Universe {
  constructor() {
    this.MAP_SIDE = 10000;
    this.FIELD_BYTES = 3;
    this.MAP_BUFFER_SIZE = this.MAP_SIDE * this.MAP_SIDE * this.FIELD_BYTES;

    // this.MAX_SOLIANS = 65535;
    // this.SOLIAN_BYTES = 11;
    // this.SOLIANS_BUFFER_SIZE = this.MAX_SOLIANS * this.SOLIAN_BYTES;

    this.map = Buffer.alloc(this.MAP_BUFFER_SIZE);

    for (let i = 0; i < this.MAP_BUFFER_SIZE; i += this.FIELD_BYTES) {
      this.map.writeUInt8(Math.floor(2 * Math.random()), i);
      this.map.writeUInt16BE(0, i + 1);
    }

    this.solians = [new Solian(1, 1, 1, 'Linih'), new Solian(2, 3, 3, 'Rimira')];


    this.setSolian(1, 1, 1);
    this.setSolian(2, 3, 3);
  }

  getSolian(id) {
    if (id === 0) return null;
    return this.solians.filter(solian => solian.id === id)[0];
  }

  getField(x, y) {
    const type = this.map.readUInt8(this.FIELD_BYTES * (x * this.MAP_SIDE + y));
    const id = this.map.readUInt16BE(this.FIELD_BYTES * (x * this.MAP_SIDE + y) + 1);

    return new Field(x, y, type, this.getSolian(id));
  }

  setSolian(id, x, y) {
    this.map.writeUInt16BE(id, this.FIELD_BYTES * (x * this.MAP_SIDE + y) + 1);
  }

  getPart(x, y, dx, dy) {
    const part = [];

    for (let i = x; i < x + dx; i++) {
      part[i - x] = [];
      for (let j = y; j < y + dy; j++) {
        part[i - x][j - y] = this.getField(i, j);
      }
    }

    return part;
  }

  moveOneStep(id, x, y) {
    return new Promise(function (resolve, reject) {
      const obj = this.getSolian(id);

      if (!obj) reject('no object');
      if (obj.state !== 'standing') return reject('is moving');
      if (Math.abs(x) + Math.abs(y) !== 1) return reject('not simple');
      if (obj.x + x < 0 || obj.x + x >= this.MAP_SIDE) return reject('out of range');
      if (obj.y + y < 0 || obj.y + y >= this.MAP_SIDE) return reject('out of range');
      if (this.getField(obj.x + x, obj.y + y).object) return reject('not empty');

      obj.state = 'moving';

      setTimeout(function () {
        if (this.getField(obj.x + x, obj.y + y).object) {
          obj.state = 'standing';
          return reject('not empty');
        }
        this.setSolian(0, obj.x, obj.y);

        obj.x += x;
        obj.y += y;
        obj.state = 'standing';

        this.setSolian(obj.id, obj.x, obj.y);
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
};
