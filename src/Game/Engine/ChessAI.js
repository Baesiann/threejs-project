import { State } from "../State";

const pieceValue = {
    pawn: 10,
    knight: 30,
    bishop: 30,
    rook: 50,
    queen: 90,
    king: 900
}

class ChessAI {
    constructor(state) {
        this.state = state;
    }

    getRandomMove(state) {
        const moves = state.moves;
        
        var move = moves[Math.floor(Math.random() * moves.length)];

        return { ...move };
    }

    getBestMove(state) {
        let bestMove = null;
        let bestValue = -Infinity;
        
        const moves = state.moves; // Your existing function
        
        for (const move of moves) {
            state.makeMove(move);
            // Search 3 moves deep
            let boardValue = this.minimax(state, 3, -Infinity, Infinity, false);
            state.unmakeMove(move); // You need to write this!

            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }
        return bestMove;
    }

    minimax(state, depth, alpha, beta, isMaximizing) {
        if (depth === 0) return this.evaluate(state);
        
        // ... recursive logic with alpha-beta pruning ...
    }

    evaluate(state) {
        // ... sum up piece values and square bonuses ...
    }
}

export { ChessAI };