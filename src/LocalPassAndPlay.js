import { Client } from 'boardgame.io/react';

import LaserChessGame from './LaserChessGame';
import Content from './render/Content';

const LaserChessClient = Client({
  game: LaserChessGame,
  board: Content,
  debug: false,
});

export default LaserChessClient;
