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
        this.isCheck = this.detectCheck();
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

        this.colorToMove = (this.colorToMove === Piece.White) ? Piece.Black : Piece.White;
    }

    unmakeMove(move, captured) {
        this.Squares[move.from] = move.originalPiece;
        this.Squares[move.to] = captured;

        this.pendPromotion = 0;

        this.colorToMove = (this.colorToMove === Piece.White) ? Piece.Black : Piece.White;
    }

    getLegalMoves(square) {
        return this.moves.filter(m => m.from === square);
    }

    detectCheck() {
        // King of color to move
        const kingType = (this.colorToMove | 1);
        const kingSquare = this.Squares.findIndex(s => s === kingType);

        if (kingSquare === -1) return false;    // safety, shouldn't happen

        // flip to see attackers
        const originalTurn = this.colorToMove;
        this.colorToMove = (this.colorToMove === 8) ? 16 : 8;

        // generate opponent moves
        const oppMoves = generateMoves(this);

        const isUnderAttack = oppMoves.some(m => m.to === kingSquare);

        this.colorToMove = originalTurn;

        return isUnderAttack;
    }

    clone() {
        return new State(
            [...this.Squares],
            this.colorToMove,
            this.castling,
            this.en_passantable,
            this.halfmove,
            this.fullmove
        );
    }

    //use for testing
    init() {
        const board = new State();
        console.log(board);
    }
}

export { State };