export default class Square {
  constructor(rank, file) {
    this.id = `${rank}-${file}`;
    this.rank = rank;
    this.file = file;
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
    if (this.piece) {
      const piece = this.piece;
      this.piece.clearPosition();
      this.piece = null;
      return piece;
    }
    return null;
  }

  getFileAsLetter() {
    return String.fromCharCode(this.file + 96); // 97 = 'a'
  }

  clone() {
    const clonedSquare = new Square(this.rank, this.file);
    if (this.hasPiece()) {
      clonedSquare.piece = this.piece.clone();
    }
    return clonedSquare;
  }

  is(other) {
    return this.id === other.id;
  }
}
