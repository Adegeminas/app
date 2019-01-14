import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store.js';

import MainComponent from './components/MainComponent.js';

const socket = window.io.connect();

// document.oncontextmenu = function (e) {
//   e.preventDefault();
// };

ReactDOM.render(
  <Provider store = { store }>
    <MainComponent socket = { socket }/>
  </Provider>,

  document.getElementById('root')
);
