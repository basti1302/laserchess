import React from 'react';
import { Lobby } from 'boardgame.io/react';

import LaserChessGame from './LaserChessGame';
import Content from './render/Content';

let baseUrl;
try {
  const url = new URL(window.location.href);
  baseUrl = `${url.protocol}//${url.host}`;
} catch (e) {
  const url = window.URL(window.location.href);
  baseUrl = `${url.protocol}//${url.host}`;
}

export default function App() {
  return (
    <div className="App">
      <Lobby
        gameServer={baseUrl}
        lobbyServer={baseUrl}
        gameComponents={[{ game: LaserChessGame, board: Content }]}
      />
    </div>
  );
}
