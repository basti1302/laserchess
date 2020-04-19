import React from 'react';

import Piece from './Piece';
import {
  START,
  REFLECTED_LEFT,
  REFLECTED_RIGHT,
  REFLECTED_STRAIGHT,
  ABSORB,
  DESTROY,
} from '../engine/laser/SegmentType';

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

    let shotDivs = [];
    if (this.props.G.shot && this.props.stage === 'renderShotStage') {
      const shotSegmentsOnThisSquare = this.props.G.shot.segments.filter(
        (shotSegment) => shotSegment.square === square,
      );
      for (let i = 0; i < shotSegmentsOnThisSquare.length; i++) {
        const segment = shotSegmentsOnThisSquare[i];
        const shot1Classes = [
          styles['shot-segment'],
          styles[`shot-segment-${segment.orientation.cssClass}`],
        ];
        if (segment.type === START) {
          shot1Classes.push(styles['shot-segment-start']);
        } else if (
          segment.type === DESTROY ||
          segment.type === ABSORB ||
          segment.type === REFLECTED_STRAIGHT
        ) {
          shot1Classes.push(styles['shot-segment-end']);
        } else if (
          segment.type === REFLECTED_LEFT ||
          segment.type === REFLECTED_RIGHT
        ) {
          shot1Classes.push(styles['shot-segment-reflection-leg-one']);
          const secondOrientation =
            segment.type === REFLECTED_LEFT
              ? segment.orientation.rotateLeft()
              : segment.orientation.rotateRight();
          const shot2Classes = [
            styles['shot-segment'],
            styles[`shot-segment-${secondOrientation.cssClass}`],
            styles['shot-segment-reflection-leg-two'],
          ];
          shotDivs.push(
            <div key={`${i}-2`} className={shot2Classes.join(' ')} />,
          );
        }
        shotDivs.push(
          <div key={`${i}-1`} className={shot1Classes.join(' ')} />,
        );
      }
    }

    const id = this.props.square.id;
    const piece = this.props.square.getPiece();
    return (
      <td className={classes.join(' ')} key={id} onClick={() => this.onClick()}>
        <div className={styles['square-div']}>
          {piece && <Piece piece={piece} />}
          {shotDivs.map((shotDiv) => shotDiv)}
        </div>
      </td>
    );
  }
}
