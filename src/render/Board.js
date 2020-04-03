import React from 'react';

import {ranks, files} from '../engine/Board';

import Square from './Square';

export default class Board extends React.Component {
  isActive(id) {
  }

  render() {
    const board = this.props.G.board;
    let tbody = [];
    for (let file = files; file > 0; file--) {
      let squaresForOneFile = [];
      for (let rank = 1; rank <= ranks; rank++) {
        squaresForOneFile.push(
          <Square
            G={this.props.G}
            ctx={this.props.ctx}
            moves={this.props.moves}
            events={this.props.events}
            square={board.getSquare(file, rank)}
          />,
        );
      }
      tbody.push(<tr key={file}>{squaresForOneFile}</tr>);
    }

    return (
      <div>
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>
      </div>
    );
  }
}
