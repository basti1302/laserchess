import {immerable} from 'immer';

let move = 0;

class Es6Class {
  // [immerable] = true;
  constructor() {
    this.prop = 0;
    this.nested = new AnotherEs6Class();
    this.array = [new AnotherEs6Class()];
  }
}

class AnotherEs6Class {
  // [immerable] = true;
  constructor() {
    this.prop = 0;
  }
}

function Es5Class() {
  this.prop = 0;
}
// Es5Class[immerable] = true;

function executeMove(G, ctx) {
  const master = isMaster();

  console.log(
    `before move ${move}, on ${master ? 'master' : 'client'}`,
    JSON.stringify(G, null, 2),
  );

  G.propInG++;
  G.objectLiteral.prop++;
  G.es5Object.prop++;
  G.es6Object.prop++;
  G.es6Object.nested.prop++;
  G.es6Object.array[0].prop++;

  console.log(
    `after move ${move}, on ${master ? 'master' : 'client'}`,
    JSON.stringify(G, null, 2),
  );

  if (master) {
    move++;
  }
}

function isMaster() {
  const stackTraceTarget = {};
  Error.captureStackTrace(stackTraceTarget);
  return stackTraceTarget.stack.indexOf('Master.onUpdate') >= 0;
}

const TestGame = {
  name: 'tic-tac-toe',

  setup: () => ({
    propInG: 0,

    objectLiteral: {
      prop: 0,
    },

    es5Object: new Es5Class(),

    es6Object: new Es6Class(),
  }),

  moves: {
    executeMove,
  },

  turn: {
    moveLimit: 1,
  },
};

export default TestGame;
