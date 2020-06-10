import React from 'react';
import classNames from 'classnames';

import { getClass } from '../engine/PieceType';

import styles from './Piece.module.scss';

export default class Piece extends React.Component {
  render() {
    return (
      <div
        className={classNames(
          styles.piece,
          styles[this.props.piece.player.color.label],
          styles[getClass(this.props.piece.type, this.props.piece.player)],
          styles[this.props.piece.orientation.cssClass],
        )}
      />
    );
  }
}
