import { transferToBoard as transferSquareToBoard } from '../Square';
import { transferToBoard as transferSegmentToBoard } from './Segment';

export function create(segments, destroyedSquares) {
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

  return {
    segments,
    destroyedSquares,
  };
}

export function transferToBoard(shot, board) {
  const shotForBoard = { ...shot };
  shotForBoard.segments = shot.segments.map(segment =>
    transferSegmentToBoard(segment, board),
  );
  shotForBoard.destroyedSquares = shot.destroyedSquares.map(square =>
    transferSquareToBoard(square, board),
  );
  return shotForBoard;
}
