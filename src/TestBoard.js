import React from 'react';

class Board extends React.Component {
  onClick = () => {
    this.props.moves.executeMove();
  };

  render() {
    return (
      <button
        style={{
          width: '100px',
          height: '100px',
        }}
        onClick={() => this.onClick()}
        disabled={!this.props.isActive}>
        <br /> {this.props.isActive ? 'click me' : 'inactive'}
      </button>
    );
  }
}

export default Board;
