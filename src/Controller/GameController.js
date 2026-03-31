import { applyMove } from "../Game/applyMove";
import { Piece } from "../Game/Piece";

class GameController {
    constructor(enginerState, world) {
        this.state = enginerState;
        this.world = world;

        this.selectedPiece;
        this.moveHist = [];
        this.flipper = false;

        // listens to Raycaster.onClick();
        // Click returns userData
        window.addEventListener('game:objectClicked', (e) => {
            // console.log(e.detail);
            if (e.detail.piece) {
                this.selectPiece(e.detail);
            } else if (e.detail.name === 'indicator') {
                this.selectIndicator(e.detail);
            } else if (e.detail.promotionType) {
                this.finishPromotion(e.detail.promotionType);
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
        if (this.pendingMove) {
            // update move
            this.pendingMove.piece = pieceType;
            // console.log(this.pendingMove);
            // world needs to clear promotion UI and restore clicks
            this.world.clearPromotionUI();
            // finalize the move
            this.finalizeMove(this.pendingMove);
        }
    }

    movePiece(move) {
        applyMove(this.state, move);

        // Check for promotion
        if (this.state.pendPromotion !== 0) {
            // save the current move to finish later
            this.pendingMove = move;
            this.world.triggerPromotion(this.state.pendPromotion);
            return
        }

        // Normal move
        this.finalizeMove(move);
    }

    finalizeMove(move) {
        this.state.makeMove(move);

        // Moved from applyMove
        this.state.colorToMove = (this.state.colorToMove === Piece.White) ? Piece.Black : Piece.White;

        if (this.flipper) {
            // Dispatch an event that a move was made
            window.dispatchEvent(new CustomEvent('moveMade', {
                detail: this.state.colorToMove
            }));
        }

        this.moveHist.push(move);
        this.state.updateMoves();
        this.world.updateBoard(this.state);
        this.pendingMove = null;
        this.selectedPiece = null;
    }

}

export { GameController };