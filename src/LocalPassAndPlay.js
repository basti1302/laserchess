import { Client } from 'boardgame.io/react';

import LaserChessGame from './LaserChessGame';
import Board from './render/Board';

const LaserChessClient = Client({
  game: LaserChessGame,
  board: Board,
});

export default LaserChessClient;
