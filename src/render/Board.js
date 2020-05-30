import React from 'react';

import {ranks, files} from '../engine/Board';
import EnginePiece from '../engine/Piece';

import Piece from './Piece';
import Square from './Square';

import styles from './Board.module.css';

export default class Board extends React.Component {
  isActive(id) {
    //
  }

  render() {
    const {ctx, G, moves, events} = this.props;
    const {activePlayers, currentPlayer, gameover} = ctx;

    if (!currentPlayer) {
      throw new Error('No current player.');
    }

    let gameHasEnded = null;
    if (gameover) {
      if (gameover.winner) {
        gameHasEnded = (
          <div>
            Game has ended, player {gameover.winner.color.label} has won.{' '}
            {gameover.result}
          </div>
        );
      } else {
        gameHasEnded = <div>Game has ended in draw. {gameover.result}</div>;
      }
    }

    const stage = activePlayers && activePlayers[currentPlayer];
    if (!stage && !gameover) {
      throw new Error(`No active stage for player ${currentPlayer}.`);
    }

    if (stage === 'renderShotStage') {
      setTimeout(() => {
        // TODO This emits an error:
        // "ERROR: disallowed move: endRenderShotStage"
        // because apparently everything happening in a setTimout callback
        // happens outside of the proper context. This needs a bit more
        // investigation. Maybe rendering the laser shot should not be a stage
        // in the first place.
        moves.endRenderShotStage();
      }, 2000);
    }

    const board = G.board;
    let tbody = [];
    for (let rank = ranks; rank > 0; rank--) {
      let squaresForOneRank = [];
      let darkSquare = rank % 2 !== 0;
      for (let file = 1; file <= files; file++) {
        const square = board.getSquare(rank, file);
        squaresForOneRank.push(
          <Square
            key={square.id}
            G={G}
            ctx={ctx}
            stage={stage}
            moves={moves}
            events={events}
            square={square}
            darkSquare={file % 2 !== 0 ? darkSquare : !darkSquare}
          />,
        );
      }
      tbody.push(
        <tr className={styles.rank} key={rank}>
          {squaresForOneRank}
        </tr>,
      );
    }

    let promotionControls = null;
    if (G.possiblePromotions && G.possiblePromotions.length > 0) {
      const promotionPieces = G.possiblePromotions.map((promotionMove, idx) => (
        <li key={idx}>
          <button onClick={() => applyPromotionMove(moves, promotionMove)}>
            <Piece
              piece={
                new EnginePiece(
                  promotionMove.from.getPiece().player,
                  promotionMove.promotionTo,
                )
              }
            />
          </button>
        </li>
      ));
      promotionControls = <ul>{promotionPieces}</ul>;
    }

    const fireButton = !gameHasEnded && (
      <ul>
        <li>
          <button onClick={() => moves.fireLaser()}>🔫</button>
        </li>
      </ul>
    );
    const rotateControls = !gameHasEnded &&
      activePlayers[currentPlayer] === 'movePieceStage' && (
        <ul>
          <li>
            <button onClick={() => moves.rotatePieceRight()}>⟳</button>
          </li>
          <li>
            <button onClick={() => moves.rotatePieceLeft()}>⟲</button>
          </li>
        </ul>
      );

    return (
      <div className={styles['board-outer']}>
        <table id="board" className={styles['board-table']}>
          <tbody>{tbody}</tbody>
        </table>
        {gameHasEnded}
        {promotionControls}
        {fireButton}
        {rotateControls}
      </div>
    );
  }
}

function applyPromotionMove(moves, promotionMove) {
  moves.applyPromotionMove(promotionMove);
}
