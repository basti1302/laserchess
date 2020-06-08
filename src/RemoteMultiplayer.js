import React from 'react';
import { Lobby } from 'boardgame.io/react';

import LaserChessGame from './LaserChessGame';
import Board from './render/Board';

export default function App() {
  return (
    <div className="App">
      <Lobby
        gameServer={'http://localhost:8000'}
        lobbyServer={'http://localhost:8000'}
        gameComponents={[{ game: LaserChessGame, board: Board }]}
      />{' '}
    </div>
  );
}
