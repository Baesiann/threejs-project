import { Piece } from "./Piece";

function saveToFen(
    board,
    colorToMove,
    castling = {},
    en_passantable = '-',
    halfmove = 0,
    fullmove = 1
) {
    // reverse and split the board
    const boardCopy = board.slice().reverse();

    // keep a default for castling rights
    const {
        White_Kingside = false,
        White_Queenside = false,
        Black_Kingside = false,
        Black_Queenside = false,
    } = castling;

    let boardString = "";

    for (let rank = 0; rank < 8; rank++) {
        const row = boardCopy
            .slice(rank * 8, rank * 8 + 8)
            .reverse();

        let empties = 0;
        for (const square of row) {
            if (square === 0) {
                empties++;
            } else {
                if (empties > 0) {
                    boardString += empties;
                    empties = 0;
                }
                const color = square & Piece.Black ? Piece.Black : Piece.White;
                const type = square - color;

                let ch;
                switch (type) {
                    case Piece.King:
                        ch = 'k';
                        break;
                    case Piece.Pawn:
                        ch = 'p';
                        break;
                    case Piece.Knight:
                        ch = 'n';
                        break;
                    case Piece.Bishop:
                        ch = 'b';
                        break;
                    case Piece.Rook:
                        ch = 'r';
                        break;
                    case Piece.Queen:
                        ch = 'q';
                        break;
                    default:
                        ch = '?';
                }
                boardString += color === Piece.White ? ch.toUpperCase() : ch;
            }
        }
        if (empties > 0) boardString += empties;
        if (rank < 7) boardString += '/';
    }

    let castleString = '';
    if (White_Kingside) castleString += 'K';
    if (White_Queenside) castleString += 'Q';
    if (Black_Kingside) castleString += 'k';
    if (Black_Queenside) castleString += 'q';
    if (castleString === '') castleString = '-';

    // enhanced ifs....
    const colorChar = colorToMove === Piece.White ? 'w' : 'b';
    return `${boardString} ${colorChar} ${castleString} ${en_passantable} ${halfmove} ${fullmove}`;
}

export { saveToFen };