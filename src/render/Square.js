import React from 'react';

import Piece from './Piece';

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

    let border = '1px solid #555';
    if (square.selected) {
      border = '2px solid red';
    } else if (markAsPossibleMove) {
      border = '2px solid green';
    }

    const cellStyle = {
      border,
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      textAlign: 'center',
    };

    const id = this.props.square.id;
    const piece = this.props.square.getPiece();
    return (
      <td style={cellStyle} key={id} onClick={() => this.onClick()}>
        {piece && <Piece piece={piece} />}
      </td>
    );
  }
}
