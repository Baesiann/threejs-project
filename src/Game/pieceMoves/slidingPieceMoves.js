import { generateSlidingMoves } from "./pieceMovesUtils/generateSlidingMoves.js";

// bishop logic
function bishopMoves(state, index, type) {
    const moves = generateSlidingMoves(state, index, type);

    return moves;
}


// rook logic
function rookMoves(state, index, type) {
    const moves = generateSlidingMoves(state, index, type);

    return moves;
}


// queen logic
function queenMoves(state, index, type) {
    const moves = generateSlidingMoves(state, index, type);

    return moves;
}

export { bishopMoves, rookMoves, queenMoves };