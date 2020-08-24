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

In this mode, both players use the same board in the same browser window, on the same device. This is the most convenient for development. No back end server is necessary for this mode.

Start the front end with:

```
REACT_APP_MULTIPLAYER_MODE=local-pass-and-play yarn start
```

Then go to <http://localhost:3000/> to play.

You can also use a different port instead of the default port 3000:
```
PORT=3333 REACT_APP_MULTIPLAYER_MODE=local-pass-and-play yarn start
```

### Local Multiplayer

In this mode, the engine will render two boards into the same browser window (one below the other). Each player needs to execute the moves on their own board. It is cumbersome for actually playing a game but convenient to test multiplayer features.

Start the front end with:

```
REACT_APP_MULTIPLAYER_MODE=local-multiplayer yarn start
```

Then go to <http://localhost:3000/> to play.

No back end server is necessary for this mode.

### Remote Multiplayer

This is for playing games online. A game and lobby server needs to be started first:

```
yarn server
```

Then go to <http://localhost:8000/> or <http://127.0.0.1:8000/> to play. This will bring you to the default lobby. One player needs to create a room, then both players need to join the room. A convenient way to simulate two players is to indeed open one tabe on <http://localhost:8000/> and another one at <http://127.0.0.1:8000/>. The player names are stored in a cookie, so using two different host names helps. You can also get creative with `/etc/hosts` entries to have different host names.

The server will use port 8000 by default. You can set a custom port via

```
PORT=1234 yarn server
```

The server will also serve the front end assets from the `build` sub directory. Of course, that means that whenever you change the front end code you would need to run `yarn build` so that the change takes effect.

It is also possible to combine the game and lobby server with the front end development server with auto rebuild. To do that, start the front end clients with `yarn start` in a separate shell. The mode `remote-multiplayer` is the default multiplayer mode for the front end client, thus setting `REACT_APP_MULTIPLAYER_MODE` is not necessary. (You could set this mode explicitly with `REACT_APP_MULTIPLAYER_MODE=remote-multiplayer` if you wanted, though.)

Then, instead of using the app from the game server, use the one from the development front end server at <http://localhost:3000/> (<http://127.0.0.1:3000/>).

If you started the game and lobby server with a non-default port, you need to inform the client about that:
```
REACT_APP_GAME_SERVER_PORT=1234 REACT_APP_LOBBY_SERVER_PORT=1234 yarn start
```

