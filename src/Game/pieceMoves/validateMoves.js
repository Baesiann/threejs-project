// filters the possible moves to legal moves

import { generateMoves } from "./moveGenerator";
import { Piece } from "../Piece";

function validateMoves(state, moves) {
    const legalMoves = [];

    // Rid outer loop to match flattened generateMoves
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        let isIllegal = false;

        // check castling cases
        if (move.isCastle) {
            // can't castle out of check
            if (canOpponentReach(state, move.from)) {
                isIllegal = true;
            }

            // can't castle through check
            if (!isIllegal) {
                const direc = (move.to > move.from) ? 1 : -1;
                const crossing = move.from + direc;
                if (canOpponentReach(state, crossing)) {
                    isIllegal = true;
                }
            }
        }

        // Make the move, check destination
        if (!isIllegal) {
            const captured = state.Squares[move.to];
            state.makeMove(move);
            const sideWhoMoved = (state.colorToMove === Piece.White) ? Piece.Black : Piece.White;
            const kingPos = state.Squares.indexOf(sideWhoMoved | Piece.King);

            // Generate opponent responses
            const oppMoves = generateMoves(state);

            // if any move can take the king (mmm nested search)
            // altered to flattened search
            if (oppMoves.some(m => m.to === kingPos)) {
                isIllegal = true;
            }

            state.unmakeMove(move, captured)

            // add the move if tests passed
            if (!isIllegal) {
                legalMoves.push(move);
            }
        }
    }

    return legalMoves;
}

export { validateMoves };

// Helper function
function canOpponentReach(state, targetSquare) {
    let testState = state.clone();
    testState.colorToMove = (state.colorToMove === Piece.White) ? Piece.Black : Piece.White;
    const oppMoves = generateMoves(testState);
    // flatten search here too
    return oppMoves.some(m => m.to === targetSquare);
}