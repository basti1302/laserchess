# Laser Chess

Shoot the King!

## Contributing

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It is based on the [Boardgame.IO](https://boardgame.io/) engine.

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode. Open <http://localhost:3000> to view it in the browser. See below for testing the app in different multiplayer modes.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Game Modes

### Local Pass-And-Play

In this mode, both players use the same board in the same browser window, on the same device.

This is currently the default, simply starting

```
yarn start
```

will start the front end in this mode. No back end server is necessary for this mode. You can also start this mode explicitly with

```
REACT_APP_MULTIPLAYER_MODE=local-pass-and-play yarn start
```

Go to <http://localhost:3000/> to play.

You can also use a different port instead of the default port 3000:
```
PORT=3333 yarn start
```

### Local Multiplayer

In this mode, the engine will render two boards into the same browser window (one below the other). Each player needs to execute the moves on their own board. It is cumbersome for actually playing a game but convenient to test multiplayer features.

Start the front end with:

```
REACT_APP_MULTIPLAYER_MODE=local-multiplayer yarn start
```

No back end server is necessary for this mode.

Go to <http://localhost:3000/> to play.

### Remote Multiplayer

This is for playing games online. A game and lobby server needs to be started first:

```
yarn run server
```

The server will use port 8000 by default. You can set a custom port via

```
PORT=1234 yarn run server
```

Now, start at least two front end clients, for example:
```
PORT=3002 REACT_APP_MULTIPLAYER_MODE=remote-multiplayer yarn start
PORT=3003 REACT_APP_MULTIPLAYER_MODE=remote-multiplayer yarn start
```

If you started the game and lobby server with a non-default port, you need to
```
GAME_SERVER_PORT=1234 LOBBY_SERVER_PORT=1234 PORT=3002 REACT_APP_MULTIPLAYER_MODE=remote-multiplayer yarn start
GAME_SERVER_PORT=1234 LOBBY_SERVER_PORT=1234 PORT=3003 REACT_APP_MULTIPLAYER_MODE=remote-multiplayer yarn start
```

Open browser tabs with <http://localhost:3002> and <http://localhost:3002> to play. This will bring you to the default lobby. One player needs to create a room, then both players need to join the room.

