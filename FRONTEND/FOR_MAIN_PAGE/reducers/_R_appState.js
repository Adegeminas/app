import {
  UPDATE_WORLD_STATE,
  SELECT_CURRENT_OBJECT
} from '../actions/';

const initialDataState = {
  worldState: null,
  currentObj: null
};

function findById(ws, obj) {
  if (!obj) return;

  let newObj = null;

  ws.forEach(row => {
    row.forEach(field => {
      if (field.object && field.object.id === obj.id) {
        newObj = field.object;
      }
    });
  });

  return newObj;
}

export function appState(state = initialDataState, action) {
  switch (action.type) {
    case UPDATE_WORLD_STATE:
      const newWS = action.payload.worldState;
      const newCurrentObj = findById(JSON.parse(newWS), state.currentObj);

      return {
        ...state,
        worldState: newWS,
        currentObj: newCurrentObj
      };
    case SELECT_CURRENT_OBJECT:
      return {
        ...state,
        currentObj: action.payload.currentObj
      };
    default:
      return state;
  }
}
