import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store.js';
import socket from './socket.js';
// import MainComponent from './components/MainComponent.js';
import CanvasComponent from './components/CanvasComponent.js';

ReactDOM.render(
  <Provider store = { store }>
    <CanvasComponent socket = { socket } />
  </Provider>,

  document.getElementById('root')
);

require('./controller');

// <MainComponent socket = { socket } />
