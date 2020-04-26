import React from 'react';
import classNames from 'classnames';

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
    const overlays = [];

    let markAsPossibleMove = false;
    if (this.props.G.possibleMoves) {
      this.props.G.possibleMoves.forEach((mv) => {
        if (mv.to && mv.to === square) {
          markAsPossibleMove = true;
        }
      });
    }

    if (square.selected) {
      overlays.push(
        <div
          key="selected"
          className={classNames(styles.overlay, styles.selected)}
        />,
      );
    } else if (markAsPossibleMove) {
      overlays.push(
        <div
          key="possible-move"
          className={classNames(styles.overlay, styles['possible-move'])}
        />,
      );
    }

    if (this.props.G.shot && this.props.stage === 'renderShotStage') {
      const shotSegmentsOnThisSquare = this.props.G.shot.segments.filter(
        (shotSegment) => shotSegment.square === square,
      );
      for (let i = 0; i < shotSegmentsOnThisSquare.length; i++) {
        const segment = shotSegmentsOnThisSquare[i];

        overlays.push(
          <div
            key={`${i}-1`}
            className={classNames({
              [styles['shot-segment']]: true,
              [styles[`shot-segment-${segment.orientation.cssClass}`]]: true,
              [styles['shot-segment-start']]: segment.type === START,
              [styles['shot-segment-end']]:
                segment.type === DESTROY ||
                segment.type === ABSORB ||
                segment.type === REFLECTED_STRAIGHT,
              [styles['shot-segment-reflection-leg-one']]:
                segment.type === REFLECTED_LEFT ||
                segment.type === REFLECTED_RIGHT,
            })}
          />,
        );

        if (
          segment.type === REFLECTED_LEFT ||
          segment.type === REFLECTED_RIGHT
        ) {
          const secondOrientation =
            segment.type === REFLECTED_LEFT
              ? segment.orientation.rotateLeft()
              : segment.orientation.rotateRight();
          overlays.push(
            <div
              key={`${i}-2`}
              className={classNames(
                styles['shot-segment'],
                styles[`shot-segment-${secondOrientation.cssClass}`],
                styles['shot-segment-reflection-leg-two'],
              )}
            />,
          );
        }
      }
    }

    const id = this.props.square.id;
    const piece = this.props.square.getPiece();
    return (
      <td
        className={classNames({
          [styles.square]: true,
          [styles.dark]: this.props.darkSquare,
          [styles.light]: !this.props.darkSquare,
        })}
        key={id}
        onClick={() => this.onClick()}>
        <div className={styles['square-div']}>
          {piece && <Piece piece={piece} />}
          {overlays.map((shotDiv) => shotDiv)}
        </div>
      </td>
    );
  }
}
