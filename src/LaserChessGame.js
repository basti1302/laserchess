import {INVALID_MOVE} from 'boardgame.io/core';

import EngineBoard from './engine/Board';
import {
  BOTH_KINGS_LOST,
  CHECKMATE,
  IN_PROGRESS,
  KING_LOST,
  KING_SUICIDE,
  STALEMATE,
} from './engine/gameStates';
import {LASER} from './engine/PieceType';

function doSetup(ctx) {
  console.debug('board setup');
  const board = new EngineBoard('0', '1');
  board.setup();
  // board.testSetupCastling();
  // board.testSetupPromotion();
  // board.testSetupEnPassant();
  // board.testSetupCheckmate();
  // board.testSetupLaser();
  // board.testSetupKnightSplitLaser();
  return {
    board,
  };
}

function selectPiece(G, ctx, rank, file) {
  const currentPlayer = ctx.currentPlayer;
  console.debug(
    'selectPiece',
    rank,
    file,
    currentPlayer,
    JSON.stringify(G.possibleMoves),
  );
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
    return INVALID_MOVE;
  }

  G.possibleMoves = [];
  square.getPiece().possibleMoves(G.board, G.possibleMoves);
  G.possiblePromotions = [];

  G.board.deselectAll();
  square.selected = true;

  if (ctx.activePlayers[currentPlayer] === 'selectPieceStage') {
    ctx.events.endStage();
  }

  console.debug(
    'selectPiece done',
    rank,
    file,
    currentPlayer,
    JSON.stringify(G.possibleMoves),
  );
}

function moveSelectedPiece(G, ctx, rank, file) {
  console.debug(
    'move selected piece',
    rank,
    file,
    JSON.stringify(G.possibleMoves),
  );
  const sourceSquare = G.board.getSelectedSquare();
  if (!sourceSquare || !sourceSquare.getPiece()) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return INVALID_MOVE;
  }
  const targetSquare = G.board.getSquare(rank, file);
  if (!targetSquare) {
    console.warn('No target square:', rank, file);
    return INVALID_MOVE;
  }
  const targetPiece = targetSquare.getPiece();
  if (targetPiece && targetPiece.player.boardIoLabel === ctx.currentPlayer) {
    console.debug('selecting a different piece instead');
    selectPiece(G, ctx, rank, file);
    return INVALID_MOVE;
  }

  if (!G.possibleMoves || G.possibleMoves.length === 0) {
    console.log('this piece cannot move');
    return INVALID_MOVE;
  }

  let move;
  const moves = G.possibleMoves.filter((possibleMove) =>
    possibleMove.to.is(targetSquare),
  );
  if (moves.length === 0) {
    console.warn('illegal move');
    return INVALID_MOVE;
  } else if (moves.length === 1) {
    move = moves[0];
  } else if (moves.length > 1 && moves[0].promotion) {
    G.possiblePromotions = moves;
    ctx.events.setStage('promotionStage');
    G.rotationPiece = null;
    return INVALID_MOVE;
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

function rotatePieceLeft(G, ctx) {
  console.debug('rotate selected piece left');
  const sourceSquare = G.board.getSelectedSquare();
  if (!sourceSquare || !sourceSquare.getPiece()) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return INVALID_MOVE;
  }
  if (G.rotationPiece && !sourceSquare.getPiece().is(G.rotationPiece)) {
    console.warn('Player has already rotated a different piece.', sourceSquare);
    return INVALID_MOVE;
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
    return INVALID_MOVE;
  }
  if (G.rotationPiece && !sourceSquare.getPiece().is(G.rotationPiece)) {
    console.warn('Player has already rotated a different piece.', sourceSquare);
    return INVALID_MOVE;
  }
  sourceSquare.getPiece().rotateRight();
  G.rotationPiece = sourceSquare.getPiece();
}

function fireLaser(G, ctx) {
  console.debug('fire laser');
  let laser;
  const player = G.board.getPlayerByBoardIoLabel(ctx.currentPlayer);
  const allLaserPieces = G.board.getLaserPieces(player);
  if (allLaserPieces.length === 1) {
    laser = allLaserPieces[0];
  } else {
    const sourceSquare = G.board.getSelectedSquare();
    if (!sourceSquare || !sourceSquare.getPiece()) {
      console.warn(
        'No source square or no piece on source square.',
        sourceSquare,
      );
      return INVALID_MOVE;
    }
    laser = sourceSquare.getPiece();
    if (!laser.type.is(LASER)) {
      console.warn('Selected piece is not a laser.', sourceSquare);
      return INVALID_MOVE;
    }
  }

  if (!G.board.laserCanFire(laser)) {
    console.warn(
      'Firing this laser is not allowed (king in check after shot?)',
    );
    return INVALID_MOVE;
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

export default {
  name: 'laserchess',

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
          fireLaser,
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
    if (
      ctx.activePlayers == null ||
      ctx.currentPlayer == null ||
      ctx.activePlayers[ctx.currentPlayer] !== 'selectPieceStage'
    ) {
      // only check at the start of the turn for each player
      return null;
    }
    const player = G.board.getPlayerByBoardIoLabel(ctx.currentPlayer);
    const gameState = G.board.computeGameState(player);
    if (gameState === KING_LOST) {
      return {
        winner: player.enemy(),
        result: `The ${player.color.label} king has been shot.`,
      };
    } else if (gameState === KING_SUICIDE) {
      return {
        winner: player,
        result: `The ${
          player.enemy().color.label
        } king has been shot by its own troops.`,
      };
    } else if (gameState === BOTH_KINGS_LOST) {
      return {
        draw: true,
        result: 'Both kings have been shot.',
      };
    } else if (gameState === CHECKMATE) {
      return {
        winner: player.enemy(),
        result: `Player ${player.color.label} is in checkmate.`,
      };
    } else if (gameState === STALEMATE) {
      return {
        draw: true,
        result: `Player ${player.color.label} is in stalemate.`,
      };
    } else if (gameState === IN_PROGRESS) {
      return null;
    } else {
      throw new Error(`Unknown game state: ${JSON.stringify(gameState)}`);
    }
  },
};
