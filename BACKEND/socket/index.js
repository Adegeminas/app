// const async = require('async');
// const config = require('../config');
// const User = require('../lib/mongoose').models.users;
// const baseApiLogic = require('../lib/baseApiLogic');

module.exports = function (server) {
  const io = require('socket.io').listen(server);
  const u = require('../sol');

  io.sockets.on('connection', function (socket) {
    setInterval(function () {
      socket.emit('worldUpdate', JSON.stringify(u.map));
    }, 50);

    socket.on('move', function (obj, x, y) {
      if (!obj) return;
      u.moveObject(obj.id, x, y);
    });
  });
  return io;
};
