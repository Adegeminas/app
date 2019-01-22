import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store.js';
import socket from './socket.js';
import WebGLComponent from './components/WebGLComponent.js';

ReactDOM.render(
  <Provider store = { store }>
    <WebGLComponent socket = { socket } />
  </Provider>,

  document.getElementById('root')
);

require('./controller');
