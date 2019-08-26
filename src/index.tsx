import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import Api from './Api';
import App from './App';
import reducer from './reducer';
import Runner from './Runner';

if (typeof window.snek !== 'undefined') {
  throw new Error('GUI already loaded?');
}

const store = createStore(reducer, applyMiddleware(thunk));

window.snek = new Api(store);

const runner = new Runner();

render(
  <Provider store={store}>
    <App runner={runner} />
  </Provider>,
  document.body,
);
