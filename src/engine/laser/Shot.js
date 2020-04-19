export default class Shot {
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
      if (destroyedSquares[i].constructor.name !== 'Square') {
        throw new Error(
          `Illegal argument for destroyedSquare at index ${i}: ${destroyedSquares[i].constructor.name}: ${destroyedSquares[i]}`,
        );
      }
    }

    this.segments = segments;
    this.destroyedSquares = destroyedSquares;
  }
}
