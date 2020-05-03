import React from 'react';
import {Client} from 'boardgame.io/react';
import {Local} from 'boardgame.io/multiplayer';

import LaserChessGame from './LaserChessGame';
import Board from './render/Board';

const GameClient = Client({
  game: LaserChessGame,
  board: Board,
  multiplayer: Local(),
});

const App = () => (
  <div>
    <GameClient playerID="0" />
    <GameClient playerID="1" />
  </div>
);

export default App;
