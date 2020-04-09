export default class SegmentType {
  constructor(label) {
    this.label = label;
  }
}

export const START = new SegmentType('start');
export const STRAIGHT = new SegmentType('straight');
export const DESTROY = new SegmentType('destroy');
