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

  io.sockets.on('connection', function (socket) {
    socket.emit('setStats', { MAX_RANGE: u.MAP_SIDE});

    let lastWorldState = null;
    const updateTime = 50;

    let mainTick = setInterval(function () {
      const worldState = JSON.stringify(u.getPart(0, 0, 10, 10));

      if (worldState !== lastWorldState) {
        lastWorldState = worldState;
        socket.emit('worldUpdate', worldState, Date.now());
      }
    }, updateTime);

    socket.on('changeFokus', function (length, corner) {
      clearInterval(mainTick);

      mainTick = setInterval(function () {
        const worldState = JSON.stringify(u.getPart(corner[0], corner[1], length, length));

        if (worldState !== lastWorldState) {
          lastWorldState = worldState;
          socket.emit('worldUpdate', worldState, Date.now());
        }
      }, updateTime);
    });

    socket.on('move', function (obj, x, y) {
      if (!obj) return;
      u.moveObject(obj.id, x, y);
    });
  });
  return io;
};
