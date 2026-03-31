import { State } from "../State";
import { Piece } from "../Piece";
import * as dict from "./helperDict";

class ChessAI {
    constructor(state) {
        this.state = state;
    }

    getRandomMove(state) {
        const moves = state.moves;
        
        var move = moves[Math.floor(Math.random() * moves.length)];

        return { ...move };
    }

    instantBestMove(state) {
        let bestMove = null;
        let bestValue = (state.colorToMove === 8) ? -Infinity : Infinity;
        const moves = state.moves;

        for (const move of moves) {
            // copy (unMakeMove in future)
            let tempState = state.clone();
            // Calculate eval
            tempState.makeMove(move);
            let value = this.evaluate(tempState);
            if (state.colorToMove === 8) {
                if (value >= bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            } else {
                if (value <= bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            }
            // console.log(value);
        }

        console.log(bestValue);
        return bestMove;
    }

    getBestMove(state) {
        let bestMove = null;
        const isWhite = state.colorToMove === 8;
        let bestValue = isWhite ? -Infinity : Infinity;
        
        const moves = state.moves; // Your existing function
        
        for (const move of moves) {
            state.makeMove(move);
            // Search 3 moves deep
            let boardValue = this.minimax(state, 3, -Infinity, Infinity, !isWhite);
            state.unmakeMove(move);

            if (isWhite) {
                if (boardValue > bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            } else {
                if (boardValue < bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            }
        }
        return bestMove;
    }

    minimax(state, depth, alpha, beta, isMaximizing) {
        if (depth === 0) return this.evaluate(state);

        state.updateMoves();
        const moves = state.moves;

        if (moves.length === 0) {
            if (state.isCheck) {
                return isMaximizing ? -100000 : 100000;
            }
            return 0;   // Draw
        }

        if (isMaximizing) {
            if (moves.length === 0) {
                return -100000;     // checkmated
            }
            let maxEval = -Infinity;
            for (const move of moves) {
                const captured = state.Squares[move.to];    // save so it can be undone
                state.makeMove(move);
                state.colorToMove = (state.colorToMove === 8) ? 16 : 8;

                // recursive call
                let evaluation = this.minimax(state, depth - 1, alpha, beta, false);

                state.unmakeMove(move, captured);   // undo move
                state.colorToMove = (state.colorToMove === 8) ? 16 : 8;
                
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break;   // prune
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const captured = state.Squares[move.to];
                state.makeMove(move);
                state.colorToMove = (state.colorToMove === 8) ? 16 : 8;

                let evaluation = this.minimax(state, depth - 1, alpha, beta, true);

                state.unmakeMove(move, captured);
                state.colorToMove = (state.colorToMove === 8) ? 16 : 8;

                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break;
            }
            return minEval;
        }
        
        // ... recursive logic with alpha-beta pruning ...
    }

    evaluate(state) {
        let totalMaterial = 0;

        for (let i = 0; i < 64; i++) {
            const piece = state.Squares[i];
            if (piece === 0) continue;

            // obtain dict positions
            const row = Math.floor(i / 8);
            const col = i % 8;

            // Add a boundary guard
            if (row < 0 || row > 7 || col < 0 || col > 7) {
                console.error(`Invalid coordinates at index ${i}: [${row}][${col}]`);
                continue;
            }

            // Use bitwise & to get the piece type
            const type = piece & 0b111; // Gets the last 3 bits
            const isWhite = (piece & 8) !== 0;

            let value = dict.pieceValue[type] || 0;

            // positional bonus
            value += this.getPositionalBonus(type, row, col, isWhite);

            if (isWhite) {
                totalMaterial += value;
            } else {
                totalMaterial -= value;
            }
        }
        return totalMaterial;
    }

    // Evaluation helper
    getPositionalBonus(type, row, col, isWhite) {
        try {
            // Look up the specific table based on type and color
            switch (type) {
                case 2: // Pawn
                    return isWhite ? dict.pawnEvalWhite[row][col] : dict.pawnEvalBlack[row][col]; break;
                case 3: // Knight
                    return dict.knightEval[row][col]; break;
                case 4: // Bishop
                    return isWhite ? dict.bishopEvalWhite[row][col] : dict.bishopEvalBlack[row][col]; break;
                case 5: // Rook
                    return isWhite ? dict.rookEvalWhite[row][col] : dict.rookEvalBlack[row][col]; break;
                case 6: // Queen
                    return dict.evalQueen[row][col]; break;
                case 1: // King
                    return isWhite ? dict.kingEvalWhite[row][col] : dict.kingEvalBlack[row][col]; break;
                default:
                    return 0;
            }
        } catch (e) {
            console.error(`PST Lookup Failed! Type: ${type}, Row: ${row}, Col: ${col}, White: ${isWhite}`);
            return 0; // Fallback so the game doesn't crash
        }
    }
}

export { ChessAI };