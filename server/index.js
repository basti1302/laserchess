const Server = require('boardgame.io/server').Server;
const LaserChessGame = require('../src/LaserChessGame');

const port = 8000;

const server = Server({
  games: [LaserChessGame.default],

  // db: new DbConnector(),
});

server.run(port, () =>
  console.log(`laserchess server listening on port ${port}.`),
);
