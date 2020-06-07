import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';

import LaserChessGame from './LaserChessGame';
import Board from './render/Board';

const LaserChessClient = Client({
  game: LaserChessGame,
  board: Board,
  multiplayer: Local(),
});

const App = () => (
  <div>
    <LaserChessClient playerID="0" />
    <LaserChessClient playerID="1" />
  </div>
);

export default App;
