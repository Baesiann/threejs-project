/**
 * Parse a string to load a board position
 */

import { Piece } from "./Piece.js";

function loadFromFen(fen) {
    // Initialize an empty board
    var board = new Array(64).fill(0);

    // Dictionary to contain pieces
    const pieceFromChar = {
        'p': Piece.Pawn,
        'r': Piece.Rook,
        'n': Piece.Knight,
        'b': Piece.Bishop,
        'q': Piece.Queen,
        'k': Piece.King
    };

    // Logic to parse the fen string
    var last = fen.substring(fen.indexOf(' ') + 1);     // index of first space
    var fen_arr = fen.split(" ")[0].split("/");
    console.log(last, fen_arr);

    // Uppercase Check function
    const isUpperCase = str => /[A-Z]/.test(str);

    // Fill the board from the fen string                                 // Flip board so that "a1" is accurate
    for (let i = 0; i < fen_arr.length; i++) {          // For each row of the fen string array
        let row_index = 7 - i;
        var row_info = fen_arr[row_index].split("");    // Parse the row into individual characters
        var rowPos = 0;                                 // Store relative position pointer for piece insertion

        for (let j = 0; j < row_info.length; j++) {     // For each char in row
            if (isNaN(parseInt(row_info[j]))) {         // isChar check
                let pieceColor, pieceType;
                // Determine color and save dictionary value
                if (isUpperCase(row_info[j])) {
                    pieceColor = Piece.White;
                } else {
                    pieceColor = Piece.Black;
                }
                // Determine type and save dictionary value
                pieceType = pieceFromChar[row_info[j].toLowerCase()];
                // console.log(typeof pieceColor);
                // console.log(pieceColor | pieceType);
                board[row_index * 8 + rowPos] = pieceType | pieceColor;    // include row offset, OR pieces
                rowPos++;                               // and offset for inserting piece
            } else {
                // increment by integer
                rowPos+=parseInt(row_info[j]);
            }
        }
    }

    return board;
}

export { loadFromFen }