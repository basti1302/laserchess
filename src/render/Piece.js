import React from 'react';

export default class Piece extends React.Component {
  render() {
    return this.props.piece.type.as(this.props.piece.player);
  }
}
