// create an instance and make the moves
import { State } from "./State.js";
import { loadFromFen } from "./loadFromFen.js";
import { generateMoves } from "./moveGenerator.js";

function controller() {
    const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    // Gather starting attributes for constructor
    const {board: board, colorToMove: color, castling: castling, en_passantable: en_passantable, halfmove: halfmove, fullmove: fullmove} = loadFromFen(startPos);

    const Game = new State(board, color, castling, en_passantable, halfmove, fullmove);
    const moves = generateMoves(Game);

    console.log(moves);
    return Game;
}

export { controller };