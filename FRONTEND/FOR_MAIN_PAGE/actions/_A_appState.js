export const UPDATE_WORLD_STATE = 'UPDATE_WORLD_STATE';
export const SELECT_CURRENT_OBJECT = 'SELECT_CURRENT_OBJECT';

export const updateWorldState = worldState => ({
  type: UPDATE_WORLD_STATE,
  payload: { worldState }
});

export const selectCurrentObject = currentObj => ({
  type: SELECT_CURRENT_OBJECT,
  payload: { currentObj }
});
