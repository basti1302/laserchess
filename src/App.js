import {Client} from 'boardgame.io/react';

import EngineBoard from './engine/Board';
import RenderBoard from './render/Board';

function doSetup(ctx) {
  const board = new EngineBoard('0', '1');
  board.setup();
  return {
    board,
  };
}

function selectPiece(G, ctx, rank, file) {
  const currentPlayer = ctx.currentPlayer;
  console.log('selectPiece', rank, file, currentPlayer);
  const square = G.board.getSquare(rank, file);
  if (
    !square ||
    !square.getPiece() ||
    square.getPiece().player.boardIoLabel !== currentPlayer
  ) {
    console.warn(
      "No square or no piece to select, or opponent's piece selected:",
      rank,
      file,
      currentPlayer,
    );
    return;
  }

  G.possibleMoves = [];
  square.getPiece().possibleMoves(G.board, G.possibleMoves);

  if (!G.possibleMoves || G.possibleMoves.length === 0) {
    console.log('this piece cannot move');
    return;
  }

  G.board.deselectAll();
  square.selected = true;
  if (ctx.activePlayers[currentPlayer] === 'selectPieceStage') {
    ctx.events.endStage();
  }
}

function moveSelectedPiece(G, ctx, rank, file) {
  console.log('movePiece', rank, file);
  const sourceSquare = G.board.getSelectedSquare();
  if (!sourceSquare || !sourceSquare.getPiece()) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return;
  }
  const targetSquare = G.board.getSquare(rank, file);
  if (!targetSquare) {
    console.warn('No target square:', rank, file);
    return;
  }
  const targetPiece = targetSquare.getPiece();
  if (targetPiece && targetPiece.color === ctx.currentPlayer) {
    console.log('selecting a different piece instead');
    selectPiece(G, ctx, rank, file);
    return;
  }

  if (!G.possibleMoves || G.possibleMoves.length === 0) {
    console.log('this piece cannot move');
    return;
  }

  let move = G.possibleMoves.find(
    (possibleMove) => possibleMove.to === targetSquare,
  );

  if (!move) {
    console.log('illegal move');
    return;
  }

  if (targetPiece) {
    console.log('captured', targetPiece);
  }

  G.board.applyMove(move);
  G.possibleMoves = [];
  G.board.deselectAll();
  ctx.events.endTurn();
}

function deselectPiece(G, ctx) {
  console.log('deselectPiece');
}

const LaserChess = {
  setup: doSetup,

  moves: {
    selectPiece,
    moveSelectedPiece,
    deselectPiece,
  },

  turn: {
    onBegin: (G, ctx) => {
      ctx.events.setStage('selectPieceStage');
      return G;
    },
    stages: {
      selectPieceStage: {
        moves: {
          selectPiece,
        },
        next: 'movePieceStage',
      },
      movePieceStage: {
        moves: {
          moveSelectedPiece,
          deselectPiece,
        },
      },
    },
  },

  endIf: (G, ctx) => {
  },
};

const App = Client({
  game: LaserChess,
  board: RenderBoard,
});

export default App;