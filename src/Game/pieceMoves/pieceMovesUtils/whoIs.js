/**
 * @param {*} board 
 * @param {*} index 
 * @param {*} color 
 * @returns 0 if square is empty, 1 if square has a friendly piece, -1 if square has an enemy piece
 */
function whoIs(state, index) {
    const piece = state.Squares[index];
    if (piece === 0) return 0;

    const isWhitePiece = piece < 16;
    const isWhiteTurn = state.colorToMove === 8;

    return (isWhitePiece === isWhiteTurn) ? 1 : -1;
}

export { whoIs };