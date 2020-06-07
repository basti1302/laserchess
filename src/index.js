import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LocalPassAndPlay from './LocalPassAndPlay';
import LocalMultiplayer from './LocalMultiplayer';
import * as serviceWorker from './serviceWorker';

let App = LocalPassAndPlay;

if (process.env.REACT_APP_MULTIPLAYER_MODE === 'local-multiplayer') {
  App = LocalMultiplayer;
  console.log('Mode: Local Multiplayer');
} else {
  console.log('Mode: Local Pass-and-Play');
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
