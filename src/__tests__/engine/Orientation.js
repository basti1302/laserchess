import {NORTH, EAST, SOUTH, WEST} from '../../engine/Orientation';

describe('Orientation', () => {
  let orientation;

  test('should rotate left', () => {
    expect(NORTH.rotateLeft()).toBe(WEST);
    expect(WEST.rotateLeft()).toBe(SOUTH);
    expect(SOUTH.rotateLeft()).toBe(EAST);
    expect(EAST.rotateLeft()).toBe(NORTH);
  });

  test('should rotate right', () => {
    expect(NORTH.rotateRight()).toBe(EAST);
    expect(EAST.rotateRight()).toBe(SOUTH);
    expect(SOUTH.rotateRight()).toBe(WEST);
    expect(WEST.rotateRight()).toBe(NORTH);
  });
});
