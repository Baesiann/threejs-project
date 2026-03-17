/**
 * Takes in a state and legal move and updates state with move
 * 
 * Has to increment halfmove, fullmove (done)
 * Has to switch the turn (done)
 * If rook or king moves, proper castling update (done)
 * If double pawn move, en_passantable update (done)
 * Obviously needs to update the board (done)
 */

import { Piece } from "./Piece";

function applyMove(state, move) {
    // console.log("move: ", move);
    // if it is castling, two pieces will move
    // king will move anyways at end
    if (move.isCastle) {
        // Rook move if white kingside
        if (move.to === 6) { 
            state.makeMove(7, 5);
            state.castling.White_Kingside = false;
            state.castling.White_Queenside = false;
        }
        // Rook move if white queenside
        if (move.to === 2) {
            state.makeMove(0, 3);
            state.castling.White_Kingside = false;
            state.castling.White_Queenside = false;
        }
        // Rook move if black kingside
        if (move.to === 62) {
            state.makeMove(63, 61);
            state.castling.Black_Kingside = false;
            state.castling.Black_Queenside = false;
        }
        // Rook move if black queenside
        if (move.to === 58) {
            state.makeMove(56, 59);
            state.castling.Black_Kingside = false;
            state.castling.Black_Queenside = false;
        }
    }

    // opponnent pawn capture on enpassant
    if (move.enpassantCapture) {
        let pawnDir = 1;
        if (state.colorToMove === Piece.Black) { pawnDir = -1}

        state.Squares[move.to - (8 * pawnDir)] = 0;
    }

    // apply the update to the squares
    state.makeMove(move.from, move.to);

    // increment halfmove
    state.halfmove++;

    // increment fullmove
    if (state.colorToMove === Piece.Black) {state.fullmove++};

    // set enpassant square
    if(move.epsnt !== false) {
        state.en_passantable = move.espnt;
    } else {
        // has to be set back to false so ep doens't exist for consecutive moves
        state.en_passantable = false;
    }

    // update castling (these will never go back to true)
    if (move.from === 4) {
        state.castling.White_Kingside = false;
        state.castling.White_Queenside = false;
    }
    if (move.from === 60) {
        state.castling.Black_Kingside = false;
        state.castling.Black_Queenside = false;
    }
    if (move.from === 0) {state.castling.White_Queenside = false}
    if (move.from === 7) {state.castling.White_Kingside = false}
    if (move.from === 56) {state.castling.Black_Queenside = false}
    if (move.from === 63) {state.castling.Black_Kingside = false}

    // swap turn to move
    if (state.colorToMove === Piece.White) {
        state.colorToMove = Piece.Black;
    } else {
        state.colorToMove = Piece.White;
    }

    return state;
}

export { applyMove };