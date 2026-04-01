import { applyMove } from "../Game/applyMove";
import { Piece } from "../Game/Piece";
import { ChessAI } from "../Game/Engine/ChessAI";

class GameController {
    constructor(enginerState, world, options = {}) {
        this.state = enginerState;
        this.world = world;

        this.selectedPiece;
        this.moveHist = [];
        this.flipper = false;

        this.ai = new ChessAI(this.state);

        this.players = {
            [Piece.White]: options.white || 'human',
            [Piece.Black]: options.black || 'human'
        };

        this.isAiThinking = false;

        // listens to Raycaster.onClick();
        // Click returns userData
        // add condition to listen only if human turn
        window.addEventListener('game:objectClicked', (e) => {
            if (this.players[this.state.colorToMove] === 'human') {
                // console.log(e.detail);
                if (e.detail.piece) {
                    this.selectPiece(e.detail);
                } else if (e.detail.name === 'indicator') {
                    this.selectIndicator(e.detail);
                } else if (e.detail.promotionType) {
                    this.finishPromotion(e.detail.promotionType);
                }
            }
        });
    }

    updateBoard() {
        // console.log(this.State);
        this.world.updateBoard(this.state);
    }

    selectPiece(userData) {
        // console.log("PIECE USER DATA: ", userData);
        // Highlight legal moves when user clicks piece

        // Highlight legal moves if it's piece's color to move
        if (userData.color === this.state.colorToMove) {
            // console.log("own color", userData.color, this.state.colorToMove);
            this.selectedPiece = userData.square;
            let moves = this.state.getLegalMoves(userData.square);
            this.world.highlightSquares(moves);
        } else {
            // Check if the piece is capturable
            for (let i = 0; i < this.state.moves.length; i++) {
                // console.log(userData.square);
                if (userData.square === this.state.moves[i].to) {
                    if (this.selectedPiece === this.state.moves[i].from) {
                        this.selectIndicator(userData);
                        break;
                    }
                }
            }
        }
    }

    selectIndicator(userData) {
        // console.log("INDICATOR USER DATA: ", userData);
        this.world.highlightSquares([]);
        
        // get the full move
        // console.log(this.state.moves);
        for (let i = 0; i < this.state.moves.length; i++) {
            if (this.state.moves[i].from === this.selectedPiece) {
                if (this.state.moves[i].to === userData.square) {
                    this.movePiece(this.state.moves[i]);
                    break;
                }
            }
        }
    }

    // handles promotion selection
    finishPromotion(pieceType) {
        // only called when human promotes
        const moveInProgress = this.pendingMove;

        if (moveInProgress) {
            // update move
            this.moveInProgress.piece = pieceType;
            // console.log(this.pendingMove);
            // world needs to clear promotion UI and restore clicks
            this.world.clearPromotionUI();
            // finalize the move
            this.pendingMove = null;
            this.finalizeMove(moveInProgress);
        }
    }

    // Handle ai promotion bug
    executeAiPromotion(move, pieceType) {
        // Manually attach the piece and finalize
        move.piece = pieceType;
        this.finalizeMove(move);
    }

    movePiece(move) {
        if (!move) return;

        this.pendingMove = move;
        applyMove(this.state, move);

        // Check for promotion
        if (this.state.pendPromotion !== 0) {
            if (this.players[this.state.colorToMove] === 'ai') {
                // AI autoqueens
                const promoPiece = (this.state.pendPromotion === Piece.White) ? 14 : 22;
                this.executeAiPromotion(move, promoPiece);
            } else {
                this.world.triggerPromotion(this.state.pendPromotion);
            }
            return;
        }

        // Normal move
        this.finalizeMove(move);
    }

    finalizeMove(move) {
        this.state.makeMove(move);

        // Moved from applyMove
        // this.state.colorToMove = (this.state.colorToMove === Piece.White) ? Piece.Black : Piece.White;

        if (this.flipper) {
            // Dispatch an event that a move was made
            window.dispatchEvent(new CustomEvent('moveMade', {
                detail: this.state.colorToMove
            }));
        }

        this.moveHist.push(move);
        this.world.animateMove(move, this.state);
        this.state.updateMoves();

        this.pendingMove = null;
        this.selectedPiece = null;
        this.world.pieceGroup.children.forEach(mesh => {
            if (mesh.userData.type === 'piece') {
                mesh.userData.moves = this.state.getLegalMoves(mesh.userData.square);
            }
        });
        // safety reset
        this.isAiThinking = false;

        // Check the turn after everything updates
        this.checkNextTurn();
    }

    // check if human turn
    checkNextTurn() {
        const color = this.state.colorToMove;
        const type = this.players[color];
        const moveCount = this.state.moves ? this.state.moves.length : 0;
        // console.log(`Turn: ${color}, Type: ${type}, Moves available: ${moveCount}`);
        if (this.state.gameover) {
            console.log("PROPER GAMEOVER");
            return 0;
        }
        const nextPlayerType = this.players[this.state.colorToMove];

        if (nextPlayerType === 'ai' && !this.isAiThinking) {
            if (moveCount === 0) {
                console.warn("GAME OVER or ERROR: No moves found for AI.");
                return;
            }
            this.isAiThinking = true;

            // Give it time
            setTimeout(() => {
                this.makeAiMove();
            }, 2000);
        }
    }

    start() {
        this.checkNextTurn();
    }

    makeAiMove() {
        // give the ai a cloned state
        const tempState = this.state.clone()
        tempState.updateMoves();

        const aiMove = this.ai.getBestMove(tempState);
        console.log("AI Plays: ", aiMove);

        this.isAiThinking = false;

        this.movePiece(aiMove);
    }

}

export { GameController };