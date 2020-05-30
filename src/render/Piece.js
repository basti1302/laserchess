import React from 'react';
import classNames from 'classnames';

import styles from './Piece.module.css';

export default class Piece extends React.Component {
  render() {
    return (
      <div
        className={classNames(
          styles.piece,
          styles[this.props.piece.player.color.label],
          styles[this.props.piece.type.getClass(this.props.piece.player)],
          styles[this.props.piece.orientation.cssClass],
        )}
      />
    );
  }
}
