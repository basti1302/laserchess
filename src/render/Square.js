import React from 'react';

import Piece from './Piece';

import styles from './Square.module.css';

export default class Square extends React.Component {
  onClick() {
    const square = this.props.square;
    const currentPlayer = this.props.ctx.currentPlayer;
    const stage = this.props.ctx.activePlayers[currentPlayer];
    if (stage === 'selectPieceStage') {
      this.props.moves.selectPiece(square.rank, square.file);
    } else if (stage === 'movePieceStage') {
      this.props.moves.moveSelectedPiece(square.rank, square.file);
    } else {
      throw new Error('Unexpected stage: ' + stage);
    }
  }

  render() {
    const square = this.props.square;
    let markAsPossibleMove = false;
    if (this.props.G.possibleMoves) {
      this.props.G.possibleMoves.forEach((mv) => {
        if (mv.to && mv.to === square) {
          markAsPossibleMove = true;
        }
      });
    }

    const classes = [styles.square];

    if (this.props.darkSquare) {
      classes.push(styles.dark);
    } else {
      classes.push(styles.light);
    }

    if (square.selected) {
      classes.push(styles.selected);
    } else if (markAsPossibleMove) {
      classes.push(styles['possible-move']);
    }

    const id = this.props.square.id;
    const piece = this.props.square.getPiece();
    return (
      <td className={classes.join(' ')} key={id} onClick={() => this.onClick()}>
        {piece && <Piece piece={piece} />}
      </td>
    );
  }
}
