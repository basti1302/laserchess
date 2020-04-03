export default class Square {
  constructor(rank, file) {
    this.rank = rank;
    this.file = file;
    this.id = `${rank}-${file}`;
    this.piece = null;
  }

  asPosition() {
    return {
      rank: this.rank,
      file: this.file,
    };
  }

  setPiece(piece) {
    this.piece = piece;
    piece.setPosition(this.rank, this.file);
  }

  hasPiece() {
    return !!this.piece;
  }

  getPiece() {
    return this.piece;
  }

  removePiece() {
    this.piece = null;
  }

  getFileAsLetter() {
    return String.fromCharCode(this.file + 96); // 97 = 'a'
  }
}
