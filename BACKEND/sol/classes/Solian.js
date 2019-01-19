module.exports = class Solian {
  constructor(id, x, y, name) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.speed = 600;
    this.state = 'standing';
    this.direction = 'n';
    this.name = name;
    this.frame = 0;
  }
};
