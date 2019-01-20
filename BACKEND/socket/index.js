module.exports = function (server) {
  const io = require('socket.io').listen(server);
  const u = require('../sol');

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

  const updateTime = 5;

  io.sockets.on('connection', function (socket) {
    socket.emit('setStats', { MAX_RANGE: u.MAP_SIDE});

    // socket.on('update', debounce(function (height, width, corner) {
    //   socket.emit('worldUpdate', JSON.stringify(u.getPart(corner[0], corner[1], height, width)));
    // }), 10);

    let mainTick = setInterval(function () {
      socket.emit('worldUpdate', JSON.stringify(u.getPart(0, 0, 10, 10)));
    }, updateTime);

    socket.on('changeFokus', function (length, corner) {
      clearInterval(mainTick);

      mainTick = setInterval(function () {
        socket.emit('worldUpdate', JSON.stringify(u.getPart(corner[0], corner[1], length, length)));
      }, updateTime);
    });

    socket.on('move', function (obj, x, y) {
      if (!obj) return;
      u.moveObject(obj.id, x, y);
    });
  });
  return io;
};
