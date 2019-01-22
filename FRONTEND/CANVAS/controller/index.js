import * as Actions from '../actions';
import store from '../store.js';

window.addEventListener('keypress', function (e) {
  switch (e.key.toLowerCase()) {
    case 'q': {
      store.dispatch(Actions.changeLength(-1));
      break;
    }
    case 'e': {
      store.dispatch(Actions.changeLength(1));
      break;
    }
    case 'w': {
      store.dispatch(Actions.changeCorner(-1, 0));
      break;
    }
    case 's': {
      store.dispatch(Actions.changeCorner(1, 0));
      break;
    }
    case 'a': {
      store.dispatch(Actions.changeCorner(0, -1));
      break;
    }
    case 'd': {
      store.dispatch(Actions.changeCorner(0, 1));
      break;
    }
    default: {
      break;
    }
  }
}, false);
