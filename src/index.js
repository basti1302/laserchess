import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LocalPassAndPlay from './LocalPassAndPlay';
import LocalMultiplayer from './LocalMultiplayer';
import RemoteMultiplayer from './RemoteMultiplayer';

import * as serviceWorker from './serviceWorker';

const mode = process.env.REACT_APP_MULTIPLAYER_MODE;
let App = LocalPassAndPlay;


if (mode === 'local-pass-and-play') {
  console.log('Mode: Local Pass-and-Play');
} else if (mode === 'local-multiplayer') {
  App = LocalMultiplayer;
  console.log('Mode: Local Multiplayer');
} else if (mode === 'remote-multiplayer' || mode === '' || mode == null) {
  App = RemoteMultiplayer;
  console.log('Mode: Remote Multiplayer');
} else {
  throw new Error(`Unknown mode: ${mode}`);
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
