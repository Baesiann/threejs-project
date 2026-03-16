// create an instance and make the moves
import { State } from "./State.js";
import { loadFromFen } from "./loadFromFen.js";
import { generateMoves } from "./pieceMoves/moveGenerator.js";
import { validateMoves } from "./pieceMoves/validateMoves.js";
import { applyMove } from "./applyMove.js";

function controller() {
    const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const testPos = "8/3k4/8/8/3n4/3R4/3K1Q1r/8 w KQkq - 0 1";

    // Gather starting attributes for constructor
    const {board: board,
        colorToMove: color,
        castling: castling,
        en_passantable: en_passantable,
        halfmove: halfmove,
        fullmove: fullmove} = loadFromFen(startPos);

    const Game = new State(board, color, castling, en_passantable, halfmove, fullmove);
    const legalMoves = validateMoves(Game, generateMoves(Game));

    console.log(Game.clone());
    applyMove(Game, legalMoves[2]);
    console.log(Game.clone());

    // console.log(generateMoves(Game));
    // console.log(legalMoves);
    return Game;
}

export { controller };