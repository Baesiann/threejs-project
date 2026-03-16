// Helper for sliding pieces
// Note offset order: N,S,E,W,NE,SW,NW,SE

// Refactor: Piece types will be dealt with within the function instead of being passed as a parameter
// Thank you Sebastian Lague
import { Piece } from "../../Piece";
import { whoIs } from "./whoIs";
import { computeBoundary } from "./computeBoundary";

const numSquaresToEdge = computeBoundary();

function generateSlidingMoves (state, index, type) {
    const moves = [];
    const offsets = [8, -8, 1, -1, 9, -9, 7, -7];

    let startDirIndex = (type === Piece.Bishop) ? 4 : 0;
    let endDirIndex = (type === Piece.Rook) ? 4 : 8;

    // console.log('Piece Pushed at: ', state.Squares[index], startDirIndex, endDirIndex);

    for (let dirIndex = startDirIndex; dirIndex < endDirIndex; dirIndex++) {
        for (let i = 1; i <= numSquaresToEdge[index][dirIndex]; i++) {
            const targetIndex = index + offsets[dirIndex] * i;
            const occupant = whoIs(state, targetIndex);

            // if a friendly piece is on the square, break loop
            if (occupant === 1) {
                break;
            }

            // otherwise, add the move
            moves.push({
                from: index,
                to: targetIndex,
                piece: state.Squares[index],
                espnt: false,
                enpassantCapture: false,
                isCastle: false
            });

            // if there is an enemy on the last move, break loop
            if (occupant === - 1) {
                break;
            }
        }
    }

    return moves;
}

export { generateSlidingMoves };