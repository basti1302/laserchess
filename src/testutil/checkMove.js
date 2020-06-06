import { getFileAsLetter } from '../engine/Square';

export default function checkMove(move, from, rank, file) {
  expect(move.from).toBe(from);
  expect(move.to.rank).toEqual(rank);
  expect(getFileAsLetter(move.to)).toEqual(file);
}
