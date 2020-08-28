import { INVALID_MOVE } from 'boardgame.io/core';

import { createIntl, createIntlCache } from '@formatjs/intl';

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

import messages_de from './translations/de.json';
import messages_en from './translations/en.json';

const supportedLocales = ['en', 'de'];

let locale = 'de-DE';
locale = locale.split(/[-_]/)[0].toLowerCase();
if (supportedLocales.indexOf(locale) < 0) {
  locale = 'en';
}

const messages = {
  de: messages_de,
  en: messages_en,
}[locale];
const cache = createIntlCache();
const intl = createIntl(
  {
    locale,
    messages,
  },
  cache,
);

function doSetup(ctx) {
  console.debug('board setup');
  const board = engineBoard.create('0', '1');
  engineBoard.setup(board);

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

  recalcCanRotate(G, ctx);
  recalcLaserCanFire(G, ctx);
  if (ctx.activePlayers[currentPlayer] === 'selectPieceStage') {
    ctx.events.endStage();
  }
}

function recalcCanRotate(G, ctx) {
  const sourceSquare = engineBoard.getSelectedSquare(G.board);
  if (!sourceSquare || !sourceSquare.piece) {
    G.canRotate = false;
    G.reasonCannotRotate = 'rotate.cannot.needtoselect';
    return null;
  }
  if (G.rotationPiece && !isPiece(sourceSquare.piece, G.rotationPiece)) {
    G.canRotate = false;
    G.reasonCannotRotate = 'rotate.cannot.alreadyrotated';
    return null;
  }

  G.canRotate = true;
  G.reasonCannotRotate = null;
  return sourceSquare;
}

function rotatePieceLeft(G, ctx) {
  console.debug('rotate selected piece left');
  rotatePiece(G, ctx, rotateLeft);
}

function rotatePieceRight(G, ctx) {
  console.debug('rotate selected piece right');
  rotatePiece(G, ctx, rotateRight);
}

function rotatePiece(G, ctx, rotateFunction) {
  const sourceSquare = recalcCanRotate(G, ctx);
  if (!G.canRotate) {
    if (G.reasonCannotRotate) {
      console.warn(G.reasonCannotRotate);
    } else {
      console.warn('Cannot rotate.');
    }
    return INVALID_MOVE;
  }

  rotateFunction(sourceSquare.piece);
  G.rotationPiece = sourceSquare.piece;
  recalcLaserCanFire(G, ctx);
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

function recalcLaserCanFire(G, ctx) {
  const player = engineBoard.getPlayerByBoardIoLabel(
    G.board,
    ctx.currentPlayer,
  );
  if (!player) {
    G.laserCanFire = false;
    G.reasonLaserCannotFire = 'laser.cannotfire.noplayer';
    return null;
  }
  const allLaserPieces = engineBoard.getLaserPieces(G.board, player);
  if (allLaserPieces.length === 0) {
    G.laserCanFire = false;
    G.reasonLaserCannotFire = 'laser.cannotfire.nolaser';
    return null;
  }
  let laser;
  if (allLaserPieces.length === 1) {
    laser = allLaserPieces[0];
  } else {
    const sourceSquare = engineBoard.getSelectedSquare(G.board);
    if (!sourceSquare || !sourceSquare.piece) {
      G.laserCanFire = false;
      G.reasonLaserCannotFire = 'laser.cannotfire.needtoselect';
      return null;
    }
    laser = sourceSquare.piece;
    if (!isType(laser.type, LASER)) {
      G.laserCanFire = false;
      G.reasonLaserCannotFire = 'laser.cannotfire.needtoselect.current';
      return null;
    }
  }

  if (!engineBoard.laserCanFire(G.board, laser)) {
    G.laserCanFire = false;
    G.reasonLaserCannotFire = 'laser.cannotfire.check';
    return null;
  }

  G.laserCanFire = true;
  G.reasonLaserCannotFire = null;
  return laser;
}

function fireLaser(G, ctx) {
  console.debug('fire laser');
  const laser = recalcLaserCanFire(G, ctx);
  if (!G.laserCanFire) {
    if (G.reasonLaserCannotFire) {
      console.warn(G.reasonLaserCannotFire);
    } else {
      console.warn('The laser cannot fire.');
    }
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
      recalcCanRotate(G, ctx);
      recalcLaserCanFire(G, ctx);
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

  minPlayers: 2,
  maxPlayers: 2,

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
        result: 'game.ended.king.shot',
        msgArgs: { color: intl.formatMessage({ id: player.color }) },
      };
    } else if (gameState === KING_SUICIDE) {
      return {
        winner: player,
        result: `game.ended.king.suicide`,
        msgArgs: { color: intl.formatMessage({ id: enemy(player).color }) },
      };
    } else if (gameState === BOTH_KINGS_LOST) {
      return {
        draw: true,
        result: 'game.ended.king.both',
      };
    } else if (gameState === CHECKMATE) {
      return {
        winner: enemy(player),
        result: 'game.ended.checkmate',
        msgArgs: { color: intl.formatMessage({ id: player.color }) },
      };
    } else if (gameState === STALEMATE) {
      return {
        draw: true,
        result: 'game.ended.stalemate',
        msgArgs: { color: intl.formatMessage({ id: player.color }) },
      };
    } else if (gameState === IN_PROGRESS) {
      return null;
    } else {
      throw new Error(`Unknown game state: ${JSON.stringify(gameState)}`);
    }
  },
};
