import React from 'react';
import { Lobby } from 'boardgame.io/react';

import LaserChessGame from './LaserChessGame';
import Content from './render/Content';

const gameServerPort = process.env.REACT_APP_GAME_SERVER_PORT || 8000;
const lobbyServerPort = process.env.REACT_APP_LOBBY_SERVER_PORT || 8000;

export default function App() {
  return (
    <div className="App">
      <Lobby
        gameServer={`http://localhost:${gameServerPort}`}
        lobbyServer={`http://localhost:${lobbyServerPort}`}
        gameComponents={[{ game: LaserChessGame, board: Content }]}
      />{' '}
    </div>
  );
}
