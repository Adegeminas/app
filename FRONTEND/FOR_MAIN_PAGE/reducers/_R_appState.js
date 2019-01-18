import {
  UPDATE_WORLD_STATE,
  SELECT_CURRENT_OBJECT,
  CHANGE_MAP_LENGTH,
  CHANGE_MAP_CORNER,
  SET_STATS
} from '../actions/';

const initialDataState = {
  mapCorner: [0, 0],
  mapLength: 10,
  worldState: null,
  currentObj: null,
  MAX_RANGE: 3
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
    case SET_STATS:
      return {
        ...state,
        MAX_RANGE: action.payload.stats.MAX_RANGE,
        mapLength: Math.min(Math.floor(action.payload.stats.MAX_RANGE / 2), 10)
      };
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
    case CHANGE_MAP_LENGTH:
      return {
        ...state,
        mapLength: Math.min(Math.max(state.mapLength + action.payload.delta, 3),
          state.MAX_RANGE - Math.max(state.mapCorner[0], state.mapCorner[1]))
      };
    case CHANGE_MAP_CORNER:
      return {
        ...state,
        mapCorner: [Math.min(Math.max(state.mapCorner[0] + action.payload.deltaX, 0), state.MAX_RANGE - state.mapLength),
          Math.min(Math.max(state.mapCorner[1] + action.payload.deltaY, 0), state.MAX_RANGE - state.mapLength)]
      };
    default:
      return state;
  }
}
