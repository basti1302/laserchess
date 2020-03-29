import {Client} from 'boardgame.io/react';

import TicTacToeBoard from './TicTacToeBoard';

const rowOffset = 3;

// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  for (let row = 0; row < 3; row++) {
    if (
      isThreeInARow(
        getCell(cells, row, 0),
        getCell(cells, row, 1),
        getCell(cells, row, 2),
      )
    ) {
      return true;
    }
  }
  for (let col = 0; col < 3; col++) {
    if (
      isThreeInARow(
        getCell(cells, 0, col),
        getCell(cells, 1, col),
        getCell(cells, 2, col),
      )
    ) {
      return true;
    }
  }
  if (
    isThreeInARow(
      getCell(cells, 0, 0),
      getCell(cells, 1, 1),
      getCell(cells, 2, 2),
    )
  ) {
    return true;
  }
  return isThreeInARow(
    getCell(cells, 0, 2),
    getCell(cells, 1, 1),
    getCell(cells, 2, 0),
  );
}

function getCell(cells, row, col) {
  return cells[row * rowOffset + col];
}

function isThreeInARow(c1, c2, c3) {
  return c1 != null && c1 === c2 && c2 === c3;
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
  return cells.filter((c) => c === null).length === 0;
}

const TicTacToe = {
  setup: () => ({cells: Array(9).fill(null)}),

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id] === null) {
        G.cells[id] = ctx.currentPlayer;
      }
    },
  },

  endIf: (G, ctx) => {
    if (IsVictory(G.cells)) {
      return {winner: ctx.currentPlayer};
    }
    if (IsDraw(G.cells)) {
      return {draw: true};
    }
  },

  turn: {
    moveLimit: 1,
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({move: 'clickCell', args: [i]});
        }
      }
      return moves;
    },
  },
};

const App = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
});

export default App;
