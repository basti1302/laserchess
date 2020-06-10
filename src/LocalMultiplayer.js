import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';

import LaserChessGame from './LaserChessGame';
import Content from './render/Content';

const LaserChessClient = Client({
  game: LaserChessGame,
  board: Content,
  multiplayer: Local(),
  debug: false,
});

const App = () => (
  <div>
    <LaserChessClient playerID="0" />
    <LaserChessClient playerID="1" />
  </div>
);

export default App;
