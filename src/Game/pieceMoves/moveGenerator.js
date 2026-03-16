// Take in a state and generate psuedolegal moves

import { Piece } from "../Piece.js";
import { pawnMoves, knightMoves, kingMoves } from "./nonSlidingPieceMoves.js";
import { bishopMoves, rookMoves, queenMoves } from "./slidingPieceMoves.js";

function generateMoves(state) {
    const moves = [];
    // console.log(state.Squares);

    for (let index = 0; index < state.Squares.length; index++) {
        const piece = state.Squares[index];
        const type = piece - state.colorToMove;

        // Valid pieces of the color will have an int between 7 & 0
        if (type < 8 && type > 0) {
            moves.push(generatePieceMoves(state, type, index));
        }
    }

    return moves;
}

// switch statement to generate moves from piece
function generatePieceMoves(state, type, index) {
    switch(type) {
        case Piece.Pawn: return pawnMoves(state, index);
        case Piece.Knight: return knightMoves(state, index);
        case Piece.Bishop: return bishopMoves(state, index, type);
        case Piece.Rook: return rookMoves(state, index, type);
        case Piece.Queen: return queenMoves(state, index, type);
        case Piece.King: return kingMoves(state, index);
    }
}

export { generateMoves };