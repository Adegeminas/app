module.exports = class Field {
  constructor(x, y) {
    this.object = null;
    this.x = x;
    this.y = y;
  }

  setObject(object) {
    this.object = object;
  }
};
