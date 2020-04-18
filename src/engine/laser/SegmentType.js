export default class SegmentType {
  constructor(label) {
    this.label = label;
  }
}

export const START = new SegmentType('start');
export const STRAIGHT = new SegmentType('straight');
export const REFLECTED_LEFT = new SegmentType('reflected-left');
export const REFLECTED_RIGHT = new SegmentType('reflected-right');
export const REFLECTED_STRAIGHT = new SegmentType('reflected-straight');
export const ABSORB = new SegmentType('absorb');
export const DESTROY = new SegmentType('destroy');
