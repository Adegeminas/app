module.exports = class Solian {
  constructor(id, x, y, name) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.speed = 200;
    this.state = 'standing';
    this.name = name;
  }
};
