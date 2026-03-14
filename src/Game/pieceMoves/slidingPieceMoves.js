// bishop logic
function bishopMoves(board, index, color) {
    const dir_offsets = [7, -7, 9, -9];

    // Pass ONLY the diagonal boundary counts to the helper (offset fix)
    const diagonalBoundaries = numSquaresToEdge[index].slice(4);
    
    const moves = generateSlidingMoves(board, index, color, dir_offsets, diagonalBoundaries);

    return moves;
}


// rook logic
function rookMoves(board, index, color) {
    const dir_offsets = [8, -8, -1, 1];

    // Pass ONLY the horizontal boundary counts to the helper (offset fix)
    const horizontalBoundaries = numSquaresToEdge[index].slice(0, 4);

    const moves = generateSlidingMoves(board, index, color, dir_offsets, horizontalBoundaries);

    return moves;
}


// queen logic
function queenMoves(board, index, color) {
    const dir_offsets = [8, -8, -1, 1, 7, -7, 9, -9];

    // queen can take the whole array though
    const moves = generateSlidingMoves(board, index, color, dir_offsets, numSquaresToEdge[index]);

    return moves;
}