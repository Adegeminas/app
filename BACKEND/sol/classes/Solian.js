module.exports = class Solian {
  constructor(id, x, y, name) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.speed = 200;
    this.state = 'standing';
    this.direction = 'n';
    this.name = name;
    this.frame = 0;
    this.dir = [0, 0];
  }

  getDirection(d) {
    switch (d) {
      case 'n':
        return ([-1, 0]);
      case 's':
        return ([1, 0]);
      case 'w':
        return ([0, -1]);
      case 'e':
        return ([0, 1]);
      case 'nw':
        return ([-1, -1]);
      case 'ne':
        return ([-1, 1]);
      case 'sw':
        return ([1, -1]);
      case 'se':
        return ([1, 1]);
      default:
        break;
    }
  }
};
