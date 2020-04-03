export default function checkMove(move, from, rank, file) {
  expect(move.from).toBe(from);
  expect(move.to.rank).toEqual(rank);
  expect(move.to.getFileAsLetter()).toEqual(file);
}
