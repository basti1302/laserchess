import React from 'react';

import {ranks, files} from '../engine/Board';

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

    return (
      <div className={styles['board-outer']}>
        <table id="board" className={styles['board-table']}>
          <tbody>{tbody}</tbody>
        </table>
      </div>
    );
  }
}
