// Purpose of this file is to store and update game state
// A state object should be passed in and returned to various functions

import { generateMoves } from "./pieceMoves/moveGenerator";
import { validateMoves } from "./pieceMoves/validateMoves";
import { Piece } from "./Piece";

class State {
    constructor(squares, color, castling, en_passantable, halfmove, fullmove) {
        this.Squares = squares;
        this.colorToMove = color;
        this.castling = castling;
        this.en_passantable = en_passantable;
        this.halfmove = halfmove;
        this.fullmove = fullmove;
        this.moves;
        this.isCheck;
        // Promotion handling
        this.pendPromotion = 0;
    }

    updateMoves() {
        this.moves = validateMoves(this, generateMoves(this));
        if (this.moves.length === 0) {
            console.log("CHECKMATTTEEEEE");
        }
    }

    makeMove(move) {
        let toPiece = move.piece || this.Squares[move.from];

        this.Squares[move.to] = toPiece;
        this.Squares[move.from] = 0;

        // reset promotion
        this.pendPromotion = 0;

        return this;
    }

    getLegalMoves(square) {
        return this.moves.filter(m => m.from === square);
    }

    clone() {
        const clone = new State();
        clone.Squares = this.Squares.slice();
        clone.colorToMove = this.colorToMove;
        clone.castling = this.castling;
        clone.en_passantable = this.en_passantable;
        clone.halfmove = this.halfmove;
        clone.fullmove = this.fullmove;

        return clone;
    }

    //use for testing
    init() {
        const board = new State();
        console.log(board);
    }
}

export { State };