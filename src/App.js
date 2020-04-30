import React from 'react';
import {Lobby} from 'boardgame.io/react';

import LaserChess from './LaserChessGame';
import Board from './render/Board';

function App() {
  return (
    <div className="App">
      <Lobby
        gameServer={'http://localhost:8000'}
        lobbyServer={'http://localhost:8000'}
        gameComponents={[{game: LaserChess, board: Board}]}
      />
    </div>
  );
}

export default App;
