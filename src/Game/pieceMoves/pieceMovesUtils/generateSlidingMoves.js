// Helper for sliding pieces
// Note offset order: N,S,W,E,NW,SE,NE,SW
function generateSlidingMoves (board, index, color, offsets, boundary) {
    const moves = [];

    for (let dirIndex = 0; dirIndex < offsets.length; dirIndex++) {
        for (let i = 1; i <= boundary[dirIndex]; i++) {
            let targetIndex = index + offsets[dirIndex] * i;

            // if a friendly piece is on the square, break loop
            if (whoIs(board, targetIndex, color) == 1) {
                break;
            }

            // otherwise, add the move
            moves.push({
                from: index,
                to: targetIndex
            });

            // if there is an enemy on the last move, break loop
            if (whoIs(board, targetIndex, color) == - 1) {
                break;
            }
        }
    }

    return moves;
}