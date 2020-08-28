import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import LocalPassAndPlay from './LocalPassAndPlay';
import LocalMultiplayer from './LocalMultiplayer';
import RemoteMultiplayer from './RemoteMultiplayer';
import ButtonRow from './render/components/ButtonRow';
import Button from './render/components/Button';

const knownModes = [
  'remote-multiplayer',
  'local-multiplayer',
  'local-pass-and-play',
];

let initialMode = (process.env.REACT_APP_MULTIPLAYER_MODE || '').toLowerCase();
if (initialMode === '' || knownModes.indexOf(initialMode) < 0) {
  initialMode = 'remote-multiplayer';
}

export default function ModeSwitch() {
  const [mode, setMode] = useState(initialMode);
  return (
    <>
      <ButtonRow>
        <Button onClick={() => setMode('local-pass-and-play')}>
          <FormattedMessage id="mode.local.pass.and.play" />
        </Button>
        <Button onClick={() => setMode('remote-multiplayer')}>
          <FormattedMessage id="mode.online" />
        </Button>
      </ButtonRow>
      <SelectedMode mode={mode} />
    </>
  );
}

function SelectedMode({ mode }) {
  if (mode === 'remote-multiplayer') {
    console.log('Mode: Remote Multiplayer');
    return <RemoteMultiplayer />;
  } else if (mode === 'local-multiplayer') {
    console.log('Mode: Local Multiplayer');
    return <LocalMultiplayer />;
  } else if (mode === 'local-pass-and-play') {
    console.log('Mode: Local Pass-and-Play');
    return <LocalPassAndPlay />;
  } else {
    throw new Error(`Unknown mode: ${mode}`);
  }
}
