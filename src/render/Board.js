import React from 'react';

import { ranks, files, getSquare as getSquareFromBoard } from '../engine/Board';

import Square from './Square';

import styles from './Board.module.scss';

export default function Board({ ctx, G, moves, events, stage }) {
  const board = G.board;
  let tbody = [];
  for (let rank = ranks; rank > 0; rank--) {
    let squaresForOneRank = [];
    let darkSquare = rank % 2 !== 0;
    for (let file = 1; file <= files; file++) {
      const square = getSquareFromBoard(board, rank, file);
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

  return (
    <table id="board" className={styles['board-table']}>
      <tbody>{tbody}</tbody>
    </table>
  );
}
