import React from 'react';

import styles from './Piece.module.css';

export default class Piece extends React.Component {
  render() {
    const classes = [
      styles.piece,
      styles[this.props.piece.type.as(this.props.piece.player)],
      styles[this.props.piece.orientation.cssClass],
    ];
    return <span className={classes.join(' ')} />;
  }
}
