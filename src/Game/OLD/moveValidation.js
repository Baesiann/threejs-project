/**
 * Purpose is to filter out the available moves for legal moves
 */

import { generateMoves } from "./moveGenerator.js";

function validateMoves(moves, board, colorToMove, en_passantable, castling) {
    // for each piece
    for (let i = 0; i < moves.length; i++) {
        // for each possible move
        for (let j = 0; j < moves[i].length; j++) {
            console.log(moves[i][j]);
        }
    }

    return legalMoves;
}

export { validateMoves };