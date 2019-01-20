class Field {
  constructor(x, y, type, object) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.object = object;
    this.isMovable = this.type === 0;
  }
}

module.exports = Field;
