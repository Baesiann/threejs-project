/**
 * Generate legal moves
 */
import { Piece } from "./Piece.js";

const numSquaresToEdge = computeBoundary();

// Scans every square to collect piece moves
// example: (Squares, Piece.White)
function generateMoves(board, color, castling, en_passantable) {
    const moves = [];

    for (let index = 0; index < board.length; index++) {
        const piece = board[index];
        const type = piece - color;
        // console.log(type);

        // Piece types have an integer between 7 and 0
        // Color has to be included for capturable logic
        if (type < 8 && type > 0) {
            moves.push(
                generatePieceMoves(board, type, index, color, castling, en_passantable)
            )
        }
    }

    return moves;
}

// generates moves from piece
function generatePieceMoves(board, type, index, color, castling, en_passantable) {

    switch(type) {
        case Piece.Pawn: return pawnMoves(board, index, color, en_passantable);
        case Piece.Knight: return knightMoves(board, index, color);
        case Piece.Bishop: return bishopMoves(board, index, color);
        case Piece.Rook: return rookMoves(board, index, color);
        case Piece.Queen: return queenMoves(board, index, color);
        case Piece.King: return kingMoves(board, index, color, castling);
    }
}

/**
 * Piece logic:
 * 
 * Offset information:
 * N: 8
 * S: -8
 * E: 1
 * W: -1
 * NW: 7
 * NE: 9
 * SW: -9
 * SE: -7
 */

/**
 * @param {*} board 
 * @param {*} index 
 * @param {*} color 
 * @returns 0 if square is empty, 1 if square has a friendly piece, -1 if square has an enemy piece
 */
function whoIs(board, index, color) {
    const piece = board[index];
    const type = piece - color;

    // instantly return 0 if square is empty
    if (board[index] == 0) {
        return 0;
    }

    // return 1 if square contains friendly
    if (type < 8 && type > 0) {
        return 1;
    }

    // gotta be enemy otherwise
    return -1;
}

// pawn logic
function pawnMoves(board, index, color, en_passantable) {
    const moves = [];

    // pawnDir stores direction of pawn
    let pawnDir = 1;
    if (color === Piece.Black) { pawnDir = -1}

    // push front move is square is free
    if (board[index + (8 * pawnDir)] == 0) {
        moves.push({
            from: index,
            to: index + (8 * pawnDir)
        });
    }

    // check if pawn is on starting rank, if unblocked, can move 2
    let row = Math.floor(index / 8);
    let startRow = 1;
    if (color === Piece.Black) {
        startRow = 6;
    }
    if (board[index + (16 * pawnDir)] === 0 && row === startRow) {
        moves.push({
            from: index,
            to: index + (16 * pawnDir)
        });
    }

    // check if an enemy piece sits on the diagonal     NEW: or enpassantable
    // obtain diagonal indexes and check for realm shift
    let captureOffsets = [7, 9]; 
    for (let offset of captureOffsets) {
        let target = index + (offset * pawnDir);
        if (target >= 0 && target <= 63) {
            let targetCol = target % 8;
            // Ensure the capture is exactly 1 column away
            if (Math.abs(targetCol - (index % 8)) === 1) {
                if (target === en_passantable || whoIs(board, target, color) === -1) {
                    moves.push({ from: index, to: target });
                }
            }
        }
    }

    return moves;
}

// knight logic
// offsets: 6, -6, 10, -10, 15, -15, 17, -17
function knightMoves(board, index, color) {
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
                if (whoIs(board, index + offsets[i], color) !== 1) {
                    moves.push({
                        from: index,
                        to: index + offsets[i]
                    });
                }
            }
        }
    }

    return moves;
}

// king logic
function kingMoves(board, index, color) {
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
                if (whoIs(board, index + offsets[i], color) !== 1) {
                    moves.push({
                        from: index,
                        to: index + offsets[i]
                    });
                }
            }
        }
    }

    return moves;
}

// Helper for sliding pieces
// Note offset order: N,S,W,E,NW,SE,NE,SW
function generateSlidingMoves (board, index, color, offsets, boundary) {
    const moves = [];

    for (let dirIndex = 0; dirIndex < offsets.length; dirIndex++) {
        for (let i = 1; i <= boundary[dirIndex]; i++) {
            let targetIndex = index + offsets[dirIndex] * i;

            // if a friendly piece is on the square, break loop
            if (whoIs(board, targetIndex, color) == 1) {
                break;
            }

            // otherwise, add the move
            moves.push({
                from: index,
                to: targetIndex
            });

            // if there is an enemy on the last move, break loop
            if (whoIs(board, targetIndex, color) == - 1) {
                break;
            }
        }
    }

    return moves;
}

// bishop logic
function bishopMoves(board, index, color) {
    const dir_offsets = [7, -7, 9, -9];

    // Pass ONLY the diagonal boundary counts to the helper (offset fix)
    const diagonalBoundaries = numSquaresToEdge[index].slice(4);
    
    const moves = generateSlidingMoves(board, index, color, dir_offsets, diagonalBoundaries);

    return moves;
}

// rook logic
function rookMoves(board, index, color) {
    const dir_offsets = [8, -8, -1, 1];

    // Pass ONLY the horizontal boundary counts to the helper (offset fix)
    const horizontalBoundaries = numSquaresToEdge[index].slice(0, 4);

    const moves = generateSlidingMoves(board, index, color, dir_offsets, horizontalBoundaries);

    return moves;
}

// queen logic
function queenMoves(board, index, color) {
    const dir_offsets = [8, -8, -1, 1, 7, -7, 9, -9];

    // queen can take the whole array though
    const moves = generateSlidingMoves(board, index, color, dir_offsets, numSquaresToEdge[index]);

    return moves;
}

// Calculates number of squares to edge of the board
// store it as a module global for easy lookup
function computeBoundary() {
    const numSquaresToEdge = [];
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            let numNorth = 7 - row;
            let numSouth = row;
            let numWest = column;
            let numEast = 7 - column;

            const squareIndex = row * 8 + column;

            numSquaresToEdge[squareIndex] = [
                numNorth,
                numSouth,
                numWest,
                numEast,
                Math.min(numNorth, numWest),
                Math.min(numSouth, numEast),
                Math.min(numNorth, numEast),
                Math.min(numSouth, numWest)
            ];
        }
    }

    return numSquaresToEdge;
}

export { generateMoves };