export const UPDATE_WORLD_STATE = 'UPDATE_WORLD_STATE';
export const SELECT_CURRENT_OBJECT = 'SELECT_CURRENT_OBJECT';
export const CHANGE_MAP_LENGTH = 'CHANGE_MAP_LENGTH';
export const CHANGE_MAP_CORNER = 'CHANGE_MAP_CORNER';
export const SET_STATS = 'SET_STATS';

import store from '../store.js';
import socket from '../socket.js';

export const updateWorldState = (worldState, timeStamp, serverLag) => {
  return {
    type: UPDATE_WORLD_STATE,
    payload: { worldState, timeStamp, serverLag }
  };
};

export const selectCurrentObject = currentObj => ({
  type: SELECT_CURRENT_OBJECT,
  payload: { currentObj }
});

export const changeLength = delta => {
  const MAX_RANGE = store.getState().appState.MAX_RANGE;
  const currentLength = store.getState().appState.mapLength;
  const corner = store.getState().appState.mapCorner;
  const newLength = Math.min(Math.max(currentLength + delta, 3),
    MAX_RANGE - Math.max(corner[0], corner[1]));

  socket.emit('changeFokus',
    newLength,
    corner);

  return {
    type: CHANGE_MAP_LENGTH,
    payload: { newLength }
  };
};

export const changeCorner = (deltaX, deltaY) => {
  const MAX_RANGE = store.getState().appState.MAX_RANGE;
  const currentLength = store.getState().appState.mapLength;
  const corner = store.getState().appState.mapCorner;
  const newCorner = [Math.min(Math.max(corner[0] + deltaX, 0), MAX_RANGE - currentLength),
    Math.min(Math.max(corner[1] + deltaY, 0), MAX_RANGE - currentLength)];

  socket.emit('changeFokus',
    currentLength,
    newCorner);

  return {
    type: CHANGE_MAP_CORNER,
    payload: { newCorner }
  };
};

export const setStats = stats => ({
  type: SET_STATS,
  payload: { stats }
});
