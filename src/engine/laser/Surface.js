export default class Surface {
  constructor(label) {
    this.label = label;
  }
}

export const DEFAULT = new Surface('default');
export const REFLECT_LEFT = new Surface('reflect-left');
export const REFLECT_RIGHT = new Surface('reflect-right');
export const REFLECT_STRAIGHT = new Surface('reflect-straight');
export const SHIELD = new Surface('shield');
