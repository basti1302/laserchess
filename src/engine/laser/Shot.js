export default class Shot {
  constructor(segments, destroyedSquare) {
    if (!Array.isArray(segments)) {
      throw new Error(
        `Illegal argument for segments, must be an array, got: ${segments}`,
      );
    }
    if (destroyedSquare && destroyedSquare.constructor.name !== 'Square') {
      throw new Error(
        `Illegal argument for destroyedSquare: ${destroyedSquare.constructor.name}: ${destroyedSquare}`,
      );
    }

    this.segments = segments;
    this.destroyedSquare = destroyedSquare;
  }
}
