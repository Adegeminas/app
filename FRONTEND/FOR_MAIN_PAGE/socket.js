import * as Actions from './actions';
import store from './store.js';

const socket = window.io.connect();

socket
  .on('connect', function () {
    // ...
  })
  .on('setStats', function (stats) {
    store.dispatch(Actions.setStats(stats));
  })
  .on('worldUpdate', function (worldState, timeStamp) {
    store.dispatch(Actions.updateWorldState(worldState, timeStamp, Date.now() - timeStamp));
  });

module.exports = socket;
