import React from 'react';

import {ranks, files} from '../engine/Board';
import EnginePiece from '../engine/Piece';

import Piece from './Piece';
import Square from './Square';

import styles from './Board.module.css';

export default class Board extends React.Component {
  isActive(id) {
  }

  render() {
    const board = this.props.G.board;
    let tbody = [];
    for (let rank = ranks; rank > 0; rank--) {
      let squaresForOneRank = [];
      let darkSquare = rank % 2 !== 0;
      for (let file = 1; file <= files; file++) {
        squaresForOneRank.push(
          <Square
            G={this.props.G}
            ctx={this.props.ctx}
            moves={this.props.moves}
            events={this.props.events}
            square={board.getSquare(rank, file)}
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
    if (
      this.props.G.possiblePromotions &&
      this.props.G.possiblePromotions.length > 0
    ) {
      const promotionPieces = this.props.G.possiblePromotions.map(
        (promotionMove, idx) => (
          <li>
            <button onClick={() => applyPromotionMove(this, promotionMove)}>
              <Piece
                key={idx}
                piece={
                  new EnginePiece(
                    promotionMove.from.getPiece().player,
                    promotionMove.promotionTo,
                  )
                }
              />
            </button>
          </li>
        ),
      );
      promotionControls = <ul>{promotionPieces}</ul>;
    }

    const rotateControls = this.props.ctx.activePlayers[
      this.props.ctx.currentPlayer
    ] === 'movePieceStage' && (
      <ul>
        <li>
          <button onClick={() => this.props.moves.rotatePieceLeft()}>⟲</button>
        </li>
        <li>
          <button onClick={() => this.props.moves.rotatePieceRight()}>⟳</button>
        </li>
      </ul>
    );

    return (
      <div className={styles['board-outer']}>
        <table id="board" className={styles['board-table']}>
          <tbody>{tbody}</tbody>
        </table>
        {promotionControls}
        {rotateControls}
      </div>
    );
  }
}

function applyPromotionMove(that, promotionMove) {
  that.props.moves.applyPromotionMove(promotionMove);
}
