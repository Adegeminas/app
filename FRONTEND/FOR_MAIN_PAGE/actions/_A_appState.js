export const UPDATE_WORLD_STATE = 'UPDATE_WORLD_STATE';
export const SELECT_CURRENT_OBJECT = 'SELECT_CURRENT_OBJECT';
export const CHANGE_MAP_LENGTH = 'CHANGE_MAP_LENGTH';
export const CHANGE_MAP_CORNER = 'CHANGE_MAP_CORNER';
export const SET_STATS = 'SET_STATS';

import store from '../store.js';

export const updateWorldState = worldState => {
  if (worldState === store.getState().worldState) return { type: 'NO_ACTION'};
  return {
    type: UPDATE_WORLD_STATE,
    payload: { worldState }
  };
};

export const selectCurrentObject = currentObj => ({
  type: SELECT_CURRENT_OBJECT,
  payload: { currentObj }
});

export const changeLength = delta => ({
  type: CHANGE_MAP_LENGTH,
  payload: { delta }
});

export const changeCorner = (deltaX, deltaY) => ({
  type: CHANGE_MAP_CORNER,
  payload: { deltaX, deltaY }
});

export const setStats = stats => ({
  type: SET_STATS,
  payload: { stats }
});
