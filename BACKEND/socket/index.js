function debounce(f, ms) {
  let timer = null;

  return function (...args) {
    const onComplete = () => {
      f.apply(this, args);
      timer = null;
    };

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(onComplete, ms);
  };
}

module.exports = function (server) {
  const io = require('socket.io').listen(server);
  const u = require('../sol');

  io.sockets.on('connection', function (socket) {
    socket.emit('setStats', { MAX_RANGE: u.MAP_SIDE});

    socket.on('update', debounce(function (height, width, corner) {
      socket.emit('worldUpdate', JSON.stringify(u.getPart(corner[0], corner[1], height, width)));
    }, 50));

    socket.on('move', function (obj, x, y) {
      if (!obj) return;
      u.moveObject(obj.id, x, y);
    });
  });
  return io;
};
