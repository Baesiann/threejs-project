import { whoIs } from "./pieceMovesUtils/whoIs";
import { Piece } from "../Piece";

// pawn logic
function pawnMoves(state, index) {
    const moves = [];

    // pawnDir stores direction of pawn
    let pawnDir = 1;
    if (state.colorToMove === Piece.Black) { pawnDir = -1}

    // check if pawn is on starting rank, if unblocked, can move 2
    let row = Math.floor(index / 8);
    let startRow = 1;
    if (state.colorToMove === Piece.Black) {
        startRow = 6;
    }
    const promotionRank = (state.colorToMove === Piece.White) ? 7 : 0;

    // Helper to handle the "4 moves for promotion" vs "1 move for normal"
    const addPawnMove = (to, isCapture = false, isEnPassant = false) => {
        const targetRow = Math.floor(to / 8);
        const isPromotion = (targetRow === promotionRank);

        if (isPromotion) {
            const promoTypes = [Piece.Queen, Piece.Rook, Piece.Bishop, Piece.Knight];
            promoTypes.forEach(type => {
                moves.push({
                    from: index,
                    to: to,
                    piece: type | state.colorToMove,
                    espnt: false,
                    enpassantCapture: isEnPassant,
                    isCastle: false,
                    isPromotion: true,
                    originalPiece: state.Squares[index]
                });
            });
        } else {
            moves.push({
                from: index,
                to: to,
                piece: Piece.Pawn | state.colorToMove,
                espnt: (Math.abs(to - index) === 16) ? index + (8 * pawnDir) : false,
                enpassantCapture: isEnPassant,
                isCastle: false,
                isPromotion: false,
                originalPiece: state.Squares[index]
            });
        }
    };

    // Check forward squares
    if (state.Squares[index + (8 * pawnDir)] === 0) {
        addPawnMove(index + (8 * pawnDir)); // Helper handles if this is a promotion push

        if (row === startRow && state.Squares[index + (16 * pawnDir)] === 0) {
            addPawnMove(index + (16 * pawnDir));
        }
    }

    // check if an enemy piece sits on the diagonal
    let captureOffsets = [7, 9]; 
    for (let offset of captureOffsets) {
        let target = index + (offset * pawnDir);
        if (target >= 0 && target <= 63) {
            let targetCol = target % 8;
            // Ensure the capture is exactly 1 column away
            if (Math.abs(targetCol - (index % 8)) === 1) {
                // Normal Capture
                if (whoIs(state, target) === -1) {
                    addPawnMove(target); // Helper handles if this is a promotion capture
                }
                // trigger enpassantCapture
                // En Passant Capture (never promotes but still good with helper)
                if (target === state.en_passantable) {
                    addPawnMove(target, true, true);
                }
            }
        }
    }
    
    return moves;
}


// knight logic
// offsets: 6, -6, 10, -10, 15, -15, 17, -17
function knightMoves(state, index) {
    const moves = [];

    const offsets = [6, -6, 10, -10, 15, -15, 17, -17];

    // get the column to prevent realm shifts
    const startCol = index % 8;

    // push if in bounds or enemy (not friendly)
    for (let i = 0; i < offsets.length; i++) {
        if (index + offsets[i] >= 0 && index + offsets[i] <= 63) {
            // Check if the column jump is realistic (max 2 columns away)
            const targetCol = (index + offsets[i]) % 8;
            if (Math.abs(startCol - targetCol) <= 2) {
                if (whoIs(state, index + offsets[i]) !== 1) {
                    moves.push({
                        from: index,
                        to: index + offsets[i],
                        piece: Piece.Knight | state.colorToMove,
                        espnt: false,
                        enpassantCapture: false,
                        isCastle: false,
                        originalPiece: state.Squares[index]
                    });
                }
            }
        }
    }

    return moves;
}


// king logic
function kingMoves(state, index) {
    const moves = [];

    // THE KING CAN REALM SHIFT TOO!!??
    const startCol = index % 8;

    const offsets = [7, 8, 9, -1, 1, -9, -8, -7];

    // push if in bounds or enemy (not friendly)
    for (let i = 0; i < offsets.length; i++) {
        if (index + offsets[i] >= 0 && index + offsets[i] <= 63) {
            let target = index + offsets[i];
            const targetCol = target % 8;
            if (Math.abs(startCol - targetCol) <= 1) {
                if (whoIs(state, index + offsets[i]) !== 1) {
                    moves.push({
                        from: index,
                        to: index + offsets[i],
                        piece: Piece.King | state.colorToMove,
                        espnt: false,
                        enpassantCapture: false,
                        isCastle: false,
                        originalPiece: state.Squares[index]
                    });
                }
            }
        }
    }

    // allow the king to castle if available
    if (state.colorToMove === Piece.White) {
        if ((state.castling.White_Kingside) && (state.Squares[index + 1] === 0) && (state.Squares[index + 2] === 0)) {
            moves.push({
                from: index,
                to: index + 2,
                piece: Piece.King | state.colorToMove,
                espnt: false,
                enpassantCapture: false,
                isCastle: true,
                originalPiece: state.Squares[index]
            });
        }
        if ((state.castling.White_Queenside) && (state.Squares[index - 1] === 0) && (state.Squares[index - 2] === 0) && (state.Squares[index - 3] === 0)) {
            moves.push({
                from: index,
                to: index - 2,
                piece: Piece.King | state.colorToMove,
                espnt: false,
                enpassantCapture: false,
                isCastle: true,
                originalPiece: state.Squares[index]
            });
        }
    }
    if (state.colorToMove === Piece.Black) {
        if ((state.castling.Black_Kingside) && (state.Squares[index + 1] === 0) && (state.Squares[index + 2] === 0)) {
            moves.push({
                from: index,
                to: index + 2,
                piece: Piece.King | state.colorToMove,
                espnt: false,
                enpassantCapture: false,
                isCastle: true,
                originalPiece: state.Squares[index]
            });
        }
        if ((state.castling.Black_Queenside) && (state.Squares[index - 1] === 0) && (state.Squares[index - 2] === 0) && (state.Squares[index - 3] === 0)) {
            moves.push({
                from: index,
                to: index - 2,
                piece: Piece.King | state.colorToMove,
                espnt: false,
                enpassantCapture: false,
                isCastle: true,
                originalPiece: state.Squares[index]
            });
        }
    }
    //console.log(state.castling);

    return moves;
}

export { pawnMoves, knightMoves, kingMoves };