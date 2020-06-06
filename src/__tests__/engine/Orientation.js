import {
  rotateLeft,
  rotateRight,
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../engine/Orientation';

describe('Orientation', () => {
  test('should rotate left', () => {
    expect(rotateLeft(NORTH)).toBe(WEST);
    expect(rotateLeft(WEST)).toBe(SOUTH);
    expect(rotateLeft(SOUTH)).toBe(EAST);
    expect(rotateLeft(EAST)).toBe(NORTH);
  });

  test('should rotate right', () => {
    expect(rotateRight(NORTH)).toBe(EAST);
    expect(rotateRight(EAST)).toBe(SOUTH);
    expect(rotateRight(SOUTH)).toBe(WEST);
    expect(rotateRight(WEST)).toBe(NORTH);
  });
});
