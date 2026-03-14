/**
 * @param {*} board 
 * @param {*} index 
 * @param {*} color 
 * @returns 0 if square is empty, 1 if square has a friendly piece, -1 if square has an enemy piece
 */
function whoIs(state, index) {
    const piece = state.Squares[index];
    const type = piece - state.colorToMove;

    // instantly return 0 if square is empty
    if (piece == 0) {
        return 0;
    }

    // return 1 if square contains friendly
    if (type < 8 && type > 0) {
        return 1;
    }

    // gotta be enemy otherwise
    return -1;
}

export { whoIs };