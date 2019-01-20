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
  .on('worldUpdate', function (worldState) {
    // if (store.getState().worldState !== worldState) {
    store.dispatch(Actions.updateWorldState(worldState));
    // }
  });

module.exports = socket;
