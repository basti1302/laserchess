import {Client} from 'boardgame.io/react';

import {LASER} from './engine/PieceType';
import EngineBoard from './engine/Board';
import RenderBoard from './render/Board';

function doSetup(ctx) {
  console.debug('board setup');
  const board = new EngineBoard('0', '1');
  board.setup();
  // board.testSetupCastling();
  // board.testSetupPromotion();
  // board.testSetupEnPassant();
  // board.testSetupLaser();
  // board.testSetupKnight();
  return {
    board,
  };
}

function selectPiece(G, ctx, rank, file) {
  const currentPlayer = ctx.currentPlayer;
  console.debug('selectPiece', rank, file, currentPlayer);
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
  G.possiblePromotions = [];

  G.board.deselectAll();
  square.selected = true;
  if (ctx.activePlayers[currentPlayer] === 'selectPieceStage') {
    ctx.events.endStage();
  }
}

function rotatePieceLeft(G, ctx) {
  console.debug('rotate selected piece left');
  const sourceSquare = G.board.getSelectedSquare();
  if (!sourceSquare || !sourceSquare.getPiece()) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return;
  }
  if (G.rotationPiece && G.rotationPiece !== sourceSquare.getPiece()) {
    console.warn('Player has already rotated a different piece.', sourceSquare);
    return;
  }
  sourceSquare.getPiece().rotateLeft();
  G.rotationPiece = sourceSquare.getPiece();
}

function rotatePieceRight(G, ctx) {
  console.debug('rotate selected piece right');
  const sourceSquare = G.board.getSelectedSquare();
  if (!sourceSquare || !sourceSquare.getPiece()) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return;
  }
  if (G.rotationPiece && G.rotationPiece !== sourceSquare.getPiece()) {
    console.warn('Player has already rotated a different piece.', sourceSquare);
    return;
  }
  sourceSquare.getPiece().rotateRight();
  G.rotationPiece = sourceSquare.getPiece();
}

function moveSelectedPiece(G, ctx, rank, file) {
  console.debug('move selected piece', rank, file);
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
  if (targetPiece && targetPiece.player.boardIoLabel === ctx.currentPlayer) {
    console.debug('selecting a different piece instead');
    selectPiece(G, ctx, rank, file);
    return;
  }

  if (!G.possibleMoves || G.possibleMoves.length === 0) {
    console.log('this piece cannot move');
    return;
  }

  let move;
  const moves = G.possibleMoves.filter(
    (possibleMove) => possibleMove.to === targetSquare,
  );
  if (moves.length === 0) {
    console.warn('illegal move');
    return;
  } else if (moves.length === 1) {
    move = moves[0];
  } else if (moves.length > 1 && moves[0].promotion) {
    G.possiblePromotions = moves;
    ctx.events.setStage('promotionStage');
    G.rotationPiece = null;
    return;
  } else if (moves.length > 1) {
    throw new Error(`Ambigious moves that are not promotions ${moves}`);
  }

  if (targetPiece) {
    console.log('captured', targetPiece);
  }

  G.board.applyMove(move);
  endTurn(G, ctx);
}

function applyPromotionMove(G, ctx, promotionMove) {
  console.debug('apply promotion move');
  G.board.applyPromotionMove(promotionMove);
  endTurn(G, ctx);
}

function fireLaser(G, ctx) {
  console.debug('fire laser');
  const sourceSquare = G.board.getSelectedSquare();
  if (!sourceSquare || !sourceSquare.getPiece()) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return;
  }
  const laser = sourceSquare.getPiece();
  if (laser.type !== LASER) {
    console.warn('Selected piece is not a laser.', sourceSquare);
    return;
  }
  const shot = laser.fire(G.board);
  G.shot = shot;
  G.possibleMoves = [];
  G.possiblePromotions = [];
  G.board.deselectAll();
  ctx.events.setStage('renderShotStage');
}

function endRenderShotStage(G, ctx) {
  console.debug('end render shot stage');
  G.board.applyShot(G.shot);
  endTurn(G, ctx);
}

function endTurn(G, ctx) {
  console.debug('end turn');
  G.possibleMoves = [];
  G.possiblePromotions = [];
  G.board.deselectAll();
  G.shot = null;
  G.rotationPiece = null;
  ctx.events.endTurn();
}

const LaserChess = {
  setup: doSetup,

  moves: {
    selectPiece,
    rotatePieceRight,
    rotatePieceLeft,
    moveSelectedPiece,
    applyPromotionMove,
    fireLaser,
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
          rotatePieceRight,
          rotatePieceLeft,
          fireLaser,
          moveSelectedPiece,
        },
      },
      promotionStage: {
        moves: {
          applyPromotionMove,
        },
      },
      renderShotStage: {
        moves: {
          endRenderShotStage,
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
