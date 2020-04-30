import {Client} from 'boardgame.io/react';

import LaserChess from './LaserChessGame';
import Board from './render/Board';

const App = Client({
  game: LaserChess,
  board: Board,
});

export default App;
