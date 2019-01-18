import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store.js';
import socket from './socket.js';
import MainComponent from './components/MainComponent.js';

ReactDOM.render(
  <Provider store = { store }>
    <MainComponent socket = { socket }/>
  </Provider>,

  document.getElementById('root')
);

require('./controller');
