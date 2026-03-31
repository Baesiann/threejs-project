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
        this.gameover = false;
    }

    updateMoves() {
        this.moves = validateMoves(this, generateMoves(this));
        if (this.moves.length === 0) {
            this.gameover = this.isCheck ? "checkmate" : "stalemate";
        }
        return this.moves;
    }

    makeMove(move) {
        if (!move) {
            console.error("State.makeMove received undefined move!");
            return;
        }
        
        let toPiece = move.piece || this.Squares[move.from];

        if (toPiece === 0) {
            console.error(`State: No piece found at square ${move.from}!`);
            return;
        }

        this.Squares[move.to] = toPiece;
        this.Squares[move.from] = 0;

        // reset promotion
        this.pendPromotion = 0;
    }

    unmakeMove(move, captured) {
        this.Squares[move.from] = this.Squares[move.to];
        this.Squares[move.to] = captured;

        this.pendPromotion = 0;
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