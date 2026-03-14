import { generateSlidingMoves } from "./pieceMovesUtils/generateSlidingMoves.js";

// bishop logic
function bishopMoves(state, index) {
    const moves = generateSlidingMoves(state, index);

    return moves;
}


// rook logic
function rookMoves(state, index) {
    const moves = generateSlidingMoves(state, index);

    return moves;
}


// queen logic
function queenMoves(state, index) {
    const moves = generateSlidingMoves(state, index);

    return moves;
}

export { bishopMoves, rookMoves, queenMoves };