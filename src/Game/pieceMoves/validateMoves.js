// filters the possible moves to legal moves

import { generateMoves } from "./moveGenerator";
import { Piece } from "../Piece";
import { State } from "../State";

function validateMoves(state, moves) {
    const legalMoves = [];

    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < moves[i].length; j++) {
            const move = moves[i][j];
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
                let tempState = state.clone();
                tempState.makeMove(move);
                const movingColor = tempState.colorToMove;
                const kingPos = tempState.Squares.indexOf(movingColor + Piece.King);

                // Generate opponent responses
                tempState.colorToMove = (tempState.colorToMove === Piece.White) ? Piece.Black : Piece.White; 
                const oppMoves = generateMoves(tempState);

                // if any move can take the king (mmm nested search)
                if (oppMoves.some(group => group.some(m => m.to === kingPos))) {
                    isIllegal = true;
                }

                // add the move if tests passed
                if (!isIllegal) {
                    legalMoves.push(move);
                }
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
    return oppMoves.some(group => group.some(m => m.to === targetSquare));
}