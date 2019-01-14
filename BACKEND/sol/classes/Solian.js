module.exports = class Solian {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.speed = 50;
    this.state = 'standing';
  }
};
