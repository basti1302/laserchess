import {immerable} from 'immer';

import Square from '../Square';

export default class Shot {
  [immerable] = true;
  constructor(segments, destroyedSquares) {
    if (!Array.isArray(segments)) {
      throw new Error(
        `Illegal argument for segments, must be an array, got: ${JSON.stringify(
          segments,
        )}`,
      );
    }
    if (!destroyedSquares) {
      destroyedSquares = [];
    }
    if (!Array.isArray(destroyedSquares)) {
      throw new Error(
        `Illegal argument for destroyedSquares (needs to be an array): ${JSON.stringify(
          destroyedSquares,
        )}`,
      );
    }
    for (let i = 0; i < destroyedSquares.length; i++) {
      if (destroyedSquares[i].constructor !== Square) {
        throw new Error(
          `Illegal argument for destroyedSquare at index ${i}: ${JSON.stringify(
            destroyedSquares[i],
          )}`,
        );
      }
    }

    this.segments = segments;
    this.destroyedSquares = destroyedSquares;
  }
}
