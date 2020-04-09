import React from 'react';

import Piece from './Piece';
import {START, DESTROY} from '../engine/laser/SegmentType';

import styles from './Square.module.css';

export default class Square extends React.Component {
  onClick() {
    const stage = this.props.stage;
    const square = this.props.square;
    if (stage === 'selectPieceStage') {
      this.props.moves.selectPiece(square.rank, square.file);
    } else if (stage === 'movePieceStage') {
      this.props.moves.moveSelectedPiece(square.rank, square.file);
    } else {
      return;
    }
  }

  render() {
    const square = this.props.square;
    let markAsPossibleMove = false;
    if (this.props.G.possibleMoves) {
      this.props.G.possibleMoves.forEach((mv) => {
        if (mv.to && mv.to === square) {
          markAsPossibleMove = true;
        }
      });
    }

    const classes = [styles.square];

    if (this.props.darkSquare) {
      classes.push(styles.dark);
    } else {
      classes.push(styles.light);
    }

    if (square.selected) {
      classes.push(styles.selected);
    } else if (markAsPossibleMove) {
      classes.push(styles['possible-move']);
    }

    let renderedShot = null;
    if (this.props.G.shot && this.props.stage === 'renderShotStage') {
      const segment = this.props.G.shot.segments.filter(
        (shotSegment) => shotSegment.square === square,
      )[0];
      if (segment) {
        const shotClasses = [
          styles['shot-segment'],
          styles[`shot-segment-${segment.orientation.cssClass}`],
        ];
        if (segment.type === START) {
          shotClasses.push(styles['shot-segment-start']);
        } else if (segment.type === DESTROY) {
          shotClasses.push(styles['shot-segment-end']);
        }
        renderedShot = <div className={shotClasses.join(' ')} />;
      }
    }

    const id = this.props.square.id;
    const piece = this.props.square.getPiece();
    return (
      <td className={classes.join(' ')} key={id} onClick={() => this.onClick()}>
        <div className={styles['square-div']}>
          {piece && <Piece piece={piece} />}
          {renderedShot}
        </div>
      </td>
    );
  }
}
