import React from 'react';
import {Client} from 'boardgame.io/react';
import {Local} from 'boardgame.io/multiplayer';

// import LaserChessGame from './LaserChessGame';
// import Board from './render/Board';
// const GameClient = Client({
//   game: LaserChessGame,
//   board: Board,
//   multiplayer: Local(),
// });

import TestGame from './TestGame';
import Board from './TestBoard';
const GameClient = Client({
  game: TestGame,
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
