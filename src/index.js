import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import LocalPassAndPlay from './LocalPassAndPlay';
import LocalMultiplayer from './LocalMultiplayer';
import RemoteMultiplayer from './RemoteMultiplayer';

import * as serviceWorker from './serviceWorker';

import './index.css';

import messages_de from './translations/de.json';
import messages_en from './translations/en.json';

const messages = {
  de: messages_de,
  en: messages_en,
};

const i18nConfig = {
  defaultLocale: 'en',
  messages,
};

let locale = navigator.language.split(/[-_]/)[0];
if (!locale.startsWith('en') && !locale.startsWith('de')) {
  locale = 'en';
}

const mode = process.env.REACT_APP_MULTIPLAYER_MODE;
let App;

if (mode === 'remote-multiplayer' || mode === '' || mode == null) {
  App = RemoteMultiplayer;
  console.log('Mode: Remote Multiplayer');
} else if (mode === 'local-multiplayer') {
  App = LocalMultiplayer;
  console.log('Mode: Local Multiplayer');
} else if (mode === 'local-pass-and-play') {
  App = LocalPassAndPlay;
  console.log('Mode: Local Pass-and-Play');
} else {
  throw new Error(`Unknown mode: ${mode}`);
}

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider
      locale={locale}
      defaultLocale={i18nConfig.defaultLocale}
      messages={i18nConfig.messages[locale]}
    >
      <App />
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
