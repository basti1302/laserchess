import { Client } from 'boardgame.io/react';

import LaserChessGame from './LaserChessGame';
import Board from './render/Board';

const App = Client({
  game: LaserChessGame,
  board: Board,
});

export default App;
