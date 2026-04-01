import { ChessAI } from "../Game/Engine/ChessAI";
import { State } from "../Game/State";

self.onmessage = (e) => {
    const { squares, colorToMove, castling, en_passantable, halfmove, fullmove } = e.data;

    // Create a fresh state for the thread
    const workerState = new State(
        [...squares], 
        colorToMove, 
        castling,
        en_passantable, 
        halfmove, 
        fullmove
    );
    workerState.Squares = [...squares];
    workerState.colorToMove = colorToMove;
    workerState.updateMoves();

    const ai = new ChessAI(workerState);
    const bestMove = ai.getBestMove(workerState);

    self.postMessage(bestMove);
};