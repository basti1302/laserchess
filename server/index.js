const Server = require('boardgame.io/server').Server;
const LaserChessGame = require('../src/LaserChessGame');

const port = process.env.PORT || 1604;

const webroot = require('path').join(__dirname, '..', 'build');

const server = Server({
  games: [LaserChessGame.default],
});

const app = server.app;

app.use(require('koa-static')(webroot));

server.run(port, () =>
  console.log(`laserchess server listening on port ${port}.`),
);
