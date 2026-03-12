import { Piece } from "./Piece";

function saveToFen(board, colorToMove, castling, en_passantable, halfmove, fullmove) {
    var boardString = "";
    var fenString = "";

    board = board.reverse();        // Since we index a1 at 0

    // Logic to create the boardString
    for (let i = 0; i < 8; i ++) {
        let row = board.slice(i * 8, i * 8 + 8);    // obtain row info
        row = row.reverse();        // noticed backward row
        // console.log(row);
        let spaceTracker = 0;       // count space inbetween pieces

        for (let j = 0; j < row.length; j++) {
            if (row[j] !== 0) {        // square is occupied
                // Obtain type and color
                let type, color;
                if (row[j] > 16) {
                    color = Piece.Black;
                } else {
                    color = Piece.White;
                }
                type = row[j] - color;
                console.log(type);

                // Type goes into switch statement to choose concat
                let target_char = ''
                switch(type) {
                    case Piece.King:
                        target_char = 'k';
                        break;
                    case Piece.Pawn:
                        target_char = 'p';
                        break;
                    case Piece.Knight:
                        target_char = 'n';
                        break;
                    case Piece.Bishop:
                        target_char = 'b';
                        break;
                    case Piece.Rook:
                        target_char = 'r';
                        break;
                    case Piece.Queen:
                        target_char = 'q';
                        break;
                    default:
                        console.log("ugh");
                }

                // Uppercase the char if color is white
                if (color === Piece.White) {
                    target_char = target_char.toUpperCase();
                }

                // Concat spaceTracker if not 0
                if (spaceTracker > 0) {
                    boardString = boardString.concat(spaceTracker);
                }

                // Concat the piece
                boardString = boardString.concat(target_char);

                // reset spaceTracker
                spaceTracker = 0;
            }
            else {
                spaceTracker++;
            }
        }
        // concat space tracker if not 0 before /
        if (spaceTracker > 0) {
            boardString = boardString.concat(spaceTracker);
        }
        boardString = boardString.concat("/");
    }

    // remove the last / from the string
    boardString = boardString.slice(0, -1);
    console.log(boardString);

    // append the colorToMove
    if (colorToMove === Piece.White) {
        fenString = boardString.concat(" w ");
    } else {
        fenString = boardString.concat(" b ");
    }

    // append the castling rights
    fenString = fenString.concat(castling);

    // append enpassant target
    fenString = fenString.concat(" " + en_passantable);

    // append halfmove
    fenString = fenString.concat(" " + halfmove);

    // append fullmove
    fenString = fenString.concat(" " + fullmove);

    return fenString;
}

export { saveToFen };