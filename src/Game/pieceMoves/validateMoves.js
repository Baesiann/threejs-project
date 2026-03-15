// filters the possible moves to legal moves

import { generateMoves } from "./moveGenerator";
import { Piece } from "../Piece";
import { State } from "../State";

function validateMoves(state, moves) {
    const legalMoves = [];

    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < moves[i].length; j++) {
            // create a temporary state to apply the move and evaluate
            let tempState = state.clone();
            tempState.makeMove(moves[i][j].from, moves[i][j].to);
            const kingPos = tempState.Squares.indexOf(tempState.colorToMove + Piece.King);
            tempState.colorToMove = (tempState.colorToMove === Piece.White) ? Piece.Black : Piece.White;

            const oppMoves = generateMoves(tempState);

            // Begin by pushing the move to legalMoves
            legalMoves.push(moves[i][j]);
            
            // Pop the move back out if king can be captured
            for (let l = 0; l < oppMoves.length; l++) {
                for (let m = 0; m < oppMoves[l].length; m++) {
                    if (oppMoves[l][m].to === kingPos) {
                        // console.log("Illegal move removed: ", legalMoves[legalMoves.length-1]);
                        legalMoves.pop();
                    }
                }
            }
        }
    }

    return legalMoves;
}

export { validateMoves };