// Purpose of this file is to store and update game state
// A state object should be passed in and returned to various functions

import { generateMoves } from "./pieceMoves/moveGenerator";
import { validateMoves } from "./pieceMoves/validateMoves";
import { Piece } from "./Piece";
import { applyMove } from "./applyMove";

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
        // Save the state before changed
        move.prevCastling = {...this.castling};
        move.prevEnpassant = this.en_passantable;
        move.prevHalfmove = this.halfmove;
        move.prevFullmove = this.fullmove;

        // apply move
        applyMove(this, move);

        // Finalize move
        this.Squares[move.to] = move.piece || this.Squares[move.from];
        this.Squares[move.from] = 0;
        this.colorToMove = (this.colorToMove === Piece.White) ? Piece.Black : Piece.White;
    }

    unmakeMove(move, captured) {
        this.colorToMove = (this.colorToMove === Piece.White) ? Piece.Black : Piece.White;
        
        // Move piece back
        this.Squares[move.from] = move.originalPiece;
        this.Squares[move.to] = captured;

        // Move rook back if castle
        if (move.isCastle) {
            // Rook move if white kingside
            if (move.to === 6) { 
                this.Squares[7] = Piece.Rook | this.colorToMove;
                this.Squares[5] = 0;
            }
            // Rook move if white queenside
            if (move.to === 2) {
                this.Squares[0] = Piece.Rook | this.colorToMove;
                this.Squares[3] = 0;
            }
            // Rook move if black kingside
            if (move.to === 62) {
                this.Squares[63] = Piece.Rook | this.colorToMove;
                this.Squares[61] = 0;
            }
            // Rook move if black queenside
            if (move.to === 58) {
                this.Squares[56] = Piece.Rook | this.colorToMove;
                this.Squares[59] = 0;
            }
        }

        // Restore En Passant Pawn
        if (move.enpassantCapture) {
            const pawn = (move.originalPiece & 8) ? 18 : 10; // Opponent's pawn
            const pawnSq = (move.originalPiece & 8) ? move.to - 8 : move.to + 8;
            this.Squares[pawnSq] = pawn;
        }

        // Restore state
        this.castling = move.prevCastling;
        this.en_passantable = move.prevEnpassant;
        this.halfmove = move.prevHalfmove;
        this.fullmove = move.prevFullmove;

        this.pendPromotion = 0;
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