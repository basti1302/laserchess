import { INVALID_MOVE } from 'boardgame.io/core';

import * as engineBoard from './engine/Board';
import {
  BOTH_KINGS_LOST,
  CHECKMATE,
  IN_PROGRESS,
  KING_LOST,
  KING_SUICIDE,
  STALEMATE,
} from './engine/gameStates';
import {
  fire,
  is as isPiece,
  possibleMoves,
  rotateLeft,
  rotateRight,
} from './engine/Piece';
import { LASER, is as isType } from './engine/PieceType';
import { enemy } from './engine/Player';
import { is as isSquare } from './engine/Square';

function doSetup(ctx) {
  console.debug('board setup');
  const board = engineBoard.create('0', '1');
  engineBoard.setup(board);
  // engineBoard.testSetupCastling(board);
  // engineBoard.testSetupPromotion(board);
  // engineBoard.testSetupEnPassant(board);
  // engineBoard.testSetupCheckmate(board);
  // engineBoard.testSetupLaser(board);
  // engineBoard.testSetupKnightSplitLaser(board);
  return {
    board,
  };
}

function selectPiece(G, ctx, rank, file) {
  const currentPlayer = ctx.currentPlayer;
  console.debug('selectPiece', rank, file, currentPlayer);
  const square = engineBoard.getSquare(G.board, rank, file);
  if (
    !square ||
    !square.piece ||
    square.piece.player.boardIoLabel !== currentPlayer
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
  possibleMoves(square.piece, G.board, G.possibleMoves);
  G.possiblePromotions = [];

  engineBoard.deselectAll(G.board);
  square.selected = true;

  if (ctx.activePlayers[currentPlayer] === 'selectPieceStage') {
    ctx.events.endStage();
  }
}

function rotatePieceLeft(G, ctx) {
  console.debug('rotate selected piece left');
  const sourceSquare = engineBoard.getSelectedSquare(G.board);
  if (!sourceSquare || !sourceSquare.piece) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return INVALID_MOVE;
  }
  if (G.rotationPiece && !isPiece(sourceSquare.piece, G.rotationPiece)) {
    console.warn('Player has already rotated a different piece.', sourceSquare);
    return INVALID_MOVE;
  }
  rotateLeft(sourceSquare.piece);
  G.rotationPiece = sourceSquare.piece;
}

function rotatePieceRight(G, ctx) {
  console.debug('rotate selected piece right');
  const sourceSquare = engineBoard.getSelectedSquare(G.board);
  if (!sourceSquare || !sourceSquare.piece) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return INVALID_MOVE;
  }
  if (G.rotationPiece && !isPiece(sourceSquare.piece, G.rotationPiece)) {
    console.warn('Player has already rotated a different piece.', sourceSquare);
    return INVALID_MOVE;
  }
  rotateRight(sourceSquare.piece);
  G.rotationPiece = sourceSquare.piece;
}

function moveSelectedPiece(G, ctx, rank, file) {
  console.debug('move selected piece', rank, file);
  const sourceSquare = engineBoard.getSelectedSquare(G.board);
  if (!sourceSquare || !sourceSquare.piece) {
    console.warn(
      'No source square or no piece on source square.',
      sourceSquare,
    );
    return INVALID_MOVE;
  }
  const targetSquare = engineBoard.getSquare(G.board, rank, file);
  if (!targetSquare) {
    console.warn('No target square:', rank, file);
    return INVALID_MOVE;
  }
  const targetPiece = targetSquare.piece;
  if (targetPiece && targetPiece.player.boardIoLabel === ctx.currentPlayer) {
    console.debug('selecting a different piece instead');
    selectPiece(G, ctx, rank, file);
    return;
  }

  if (!G.possibleMoves || G.possibleMoves.length === 0) {
    console.log('this piece cannot move');
    return INVALID_MOVE;
  }

  let move;
  const moves = G.possibleMoves.filter(possibleMove =>
    isSquare(possibleMove.to, targetSquare),
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
    return;
  } else if (moves.length > 1) {
    throw new Error(`Ambigious moves that are not promotions ${moves}`);
  }

  if (targetPiece) {
    console.log('captured', targetPiece);
  }

  engineBoard.applyMove(G.board, move);
  endTurn(G, ctx);
}

function applyPromotionMove(G, ctx, promotionMove) {
  console.debug('apply promotion move');
  engineBoard.applyPromotionMove(G.board, promotionMove);
  endTurn(G, ctx);
}

function fireLaser(G, ctx) {
  console.debug('fire laser');
  let laser;
  const player = engineBoard.getPlayerByBoardIoLabel(
    G.board,
    ctx.currentPlayer,
  );
  const allLaserPieces = engineBoard.getLaserPieces(G.board, player);
  if (allLaserPieces.length === 1) {
    laser = allLaserPieces[0];
  } else {
    const sourceSquare = engineBoard.getSelectedSquare(G.board);
    if (!sourceSquare || !sourceSquare.piece) {
      console.warn(
        'No source square or no piece on source square.',
        sourceSquare,
      );
      return INVALID_MOVE;
    }
    laser = sourceSquare.piece;
    if (!isType(laser.type, LASER)) {
      console.warn('Selected piece is not a laser.', sourceSquare);
      return INVALID_MOVE;
    }
  }

  if (!engineBoard.laserCanFire(G.board, laser)) {
    console.warn(
      'Firing this laser is not allowed (king in check after shot?)',
    );
    return INVALID_MOVE;
  }

  const shot = fire(laser, G.board);
  G.shot = shot;
  G.possibleMoves = [];
  G.possiblePromotions = [];
  engineBoard.deselectAll(G.board);
  ctx.events.setStage('renderShotStage');
}

function endRenderShotStage(G, ctx) {
  console.debug('end render shot stage');
  engineBoard.applyShot(G.board, G.shot);
  endTurn(G, ctx);
}

function endTurn(G, ctx) {
  console.debug('end turn');
  G.possibleMoves = [];
  G.possiblePromotions = [];
  engineBoard.deselectAll(G.board);
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
    const player = engineBoard.getPlayerByBoardIoLabel(
      G.board,
      ctx.currentPlayer,
    );
    const gameState = engineBoard.computeGameState(G.board, player);
    if (gameState === KING_LOST) {
      return {
        winner: enemy(player),
        result: `The ${player.color.label} king has been shot.`,
      };
    } else if (gameState === KING_SUICIDE) {
      return {
        winner: player,
        result: `The ${
          enemy(player).color.label
        } king has been shot by its own troops.`,
      };
    } else if (gameState === BOTH_KINGS_LOST) {
      return {
        draw: true,
        result: 'Both kings have been shot.',
      };
    } else if (gameState === CHECKMATE) {
      return {
        winner: enemy(player),
        result: `Player ${player.color} is in checkmate.`,
      };
    } else if (gameState === STALEMATE) {
      return {
        draw: true,
        result: `Player ${player.color} is in stalemate.`,
      };
    } else if (gameState === IN_PROGRESS) {
      return null;
    } else {
      throw new Error(`Unknown game state: ${JSON.stringify(gameState)}`);
    }
  },
};
