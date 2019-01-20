const Solian = require('./Solian.js');
const Field = require('./Field.js');

module.exports = class Universe {
  constructor() {
    this.MAP_SIDE = 100;
    this.FIELD_BYTES = 3;
    this.MAP_BUFFER_SIZE = this.MAP_SIDE * this.MAP_SIDE * this.FIELD_BYTES;

    this.map = Buffer.alloc(this.MAP_BUFFER_SIZE);

    for (let i = 0; i < this.MAP_BUFFER_SIZE; i += this.FIELD_BYTES) {
      const type = Math.random() > 0.8 ? 1 : 0;

      this.map.writeUInt8(type, i);
      this.map.writeUInt16BE(0, i + 1);
    }

    this.solians = [
      new Solian(1, 1, 2, 'Linih'),
      new Solian(5, 5, 5, 'Rimira')
    ];

    this.setSolian(1, 1, 2);
    this.setSolian(5, 5, 5);
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

  moveOneStep(id, x, y, d) {
    return new Promise(function (resolve, reject) {
      const obj = this.getSolian(id);

      if (!obj) reject('no object');
      if (obj.state !== 'standing') return reject('is moving');
      if (obj.x + x < 0 || obj.x + x >= this.MAP_SIDE) return reject('out of range');
      if (obj.y + y < 0 || obj.y + y >= this.MAP_SIDE) return reject('out of range');

      const targetField = this.getField(obj.x + x, obj.y + y);

      if (!targetField.isMovable || targetField.object) {
        obj.state = 'standing';
        return reject('isnt movable');
      }

      obj.state = 'moving';
      obj.direction = d;
      obj.dir = obj.getDirection(d);

      const int = setInterval(function () {
        obj.frame = obj.frame === 4 ? 0 : obj.frame + 1;
      }, obj.speed / 4);

      // obj.frame = 1;

      setTimeout(function () {
        if (targetField.object) {
          obj.state = 'standing';
          obj.frame = 0;
          clearInterval(int);
          return reject('not empty');
        }
        this.setSolian(0, obj.x, obj.y);

        obj.x += x;
        obj.y += y;

        this.setSolian(obj.id, obj.x, obj.y);

        obj.state = 'standing';
        obj.frame = 0;
        clearInterval(int);
        resolve(obj);
      }.bind(this), obj.speed);
    }.bind(this));
  }

  moveObject(id, x, y) {
    if (!id) return;
    if (x === 0 && y === 0) return;

    if (x > 0 && y > 0) {
      this.moveOneStep(id, 1, 1, 'se').then(obj => this.moveObject(obj.id, x - 1, y - 1) && false).catch(console.error);
    } else if (x > 0 && y === 0) {
      this.moveOneStep(id, 1, 0, 's').then(obj => this.moveObject(obj.id, x - 1, y) && false).catch(console.error);
    } else if (x > 0 && y < 0) {
      this.moveOneStep(id, 1, -1, 'sw').then(obj => this.moveObject(obj.id, x - 1, y + 1) && false).catch(console.error);
    } else if (x === 0 && y > 0) {
      this.moveOneStep(id, 0, 1, 'e').then(obj => this.moveObject(obj.id, x, y - 1) && false).catch(console.error);
    } else if (x === 0 && y < 0) {
      this.moveOneStep(id, 0, -1, 'w').then(obj => this.moveObject(obj.id, x, y + 1) && false).catch(console.error);
    } else if (x < 0 && y === 0) {
      this.moveOneStep(id, -1, 0, 'n').then(obj => this.moveObject(obj.id, x + 1, y) && false).catch(console.error);
    } else if (x < 0 && y < 0) {
      this.moveOneStep(id, -1, -1, 'nw').then(obj => this.moveObject(obj.id, x + 1, y + 1) && false).catch(console.error);
    } else if (x < 0 && y > 0) {
      this.moveOneStep(id, -1, 1, 'ne').then(obj => this.moveObject(obj.id, x + 1, y - 1) && false).catch(console.error);
    }
  }
};
