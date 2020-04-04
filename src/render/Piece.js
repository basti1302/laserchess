import React from 'react';

import {PLAYER_WHITE, PLAYER_BLACK} from '../engine/Player';

import styles from './Piece.module.css';

export default class Piece extends React.Component {
  render() {
    const classes = [
      styles.piece,
      styles[this.props.piece.type.as(this.props.piece.player)],
    ];

    if (this.props.piece.player === PLAYER_WHITE) {
      classes.push(styles['facing-north']);
    } else if (this.props.piece.player === PLAYER_BLACK) {
      classes.push(styles['facing-south']);
    } else {
      throw new Error(`Unknown player for piece: ${this.props.piece.player}.`);
    }

    return <span className={classes.join(' ')} />;
  }
}
