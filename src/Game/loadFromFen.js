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
    // console.log(last, fen_arr);

    // Uppercase Check function
    const isUpperCase = str => /[A-Z]/.test(str);

    // Fill the board from the fen string                                 // Flip board so that "a1" is accurate
    for (let i = 0; i < fen_arr.length; i++) {          // For each row of the fen string array
        let row_index = 7 - i;
        var row_info = fen_arr[i].split("");    // Parse the row into individual characters
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
                // console.log("AT: ");
                // console.log(row_index * 8 + rowPos);
                board[row_index * 8 + rowPos] = pieceType | pieceColor;    // include row offset, OR pieces
                rowPos++;                               // and offset for inserting piece
            } else {
                // increment by integer
                rowPos+=parseInt(row_info[j]);
            }
        }
    }

    // Handle the last part of the FEN string
    var fenParseLast = last.split(' ');
    // console.log(fenParseLast);

    // Color to move
    var colorToMove;
    if (fenParseLast[0] === 'w') {
        colorToMove = Piece.White;
    } else {
        colorToMove = Piece.Black;
    }

    // Castling rights: save as dict
    let castling = {
        White_Kingside: false,
        White_Queenside: false,
        Black_Kingside: false,
        Black_Queenside: false
    };
    // split castling rights and iterate safely
    let castleParse = fenParseLast[1].split('');
    for (let i = 0; i < castleParse.length; i++) {
        const ch = castleParse[i];
        if (ch === 'K') {
            castling.White_Kingside = true;
        } else if (ch === 'Q') {
            castling.White_Queenside = true;
        } else if (ch === 'k') {
            castling.Black_Kingside = true;
        } else if (ch === 'q') {
            castling.Black_Queenside = true;
        }
    }

    // En Passant Target
    var en_passantable = fenParseLast[2];

    // Halfmove
    var halfmove = parseInt(fenParseLast[3]);

    // Fullmove
    var fullmove = parseInt(fenParseLast[4]);

    return { board, colorToMove, castling, en_passantable, halfmove, fullmove };
}

export { loadFromFen }

// function printSquares(squares) {
//     for (let r = 7; r >= 0; r--) {
//         let row = "";
//         for (let f = 0; f < 8; f++) {
//             row += squares[r*8 + f] + " ";
//         }
//         console.log(row);
//     }
// }