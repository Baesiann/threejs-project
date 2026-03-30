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

    movePiece(move) {
        // Track move
        this.moveHist.push(move);

        applyMove(this.state, move);

        if(this.state.pendPromotion === Piece.White) {
            console.log("PROMOTIONNNN");
            this.world.triggerPromotion(Piece.White);
            move.Piece = 14;
            console.log(move);
        }

        if(this.state.pendPromotion === Piece.Black) {
            console.log("BLACK PROMOOOOO");
            this.world.triggerPromotion(Piece.Black)
        }

        // apply update to squares here: promotion handling
        this.state.makeMove(move);

        if (this.flipper) {
            // Dispatch an event that a move was made
            window.dispatchEvent(new CustomEvent('moveMade', {
                detail: this.state.colorToMove
            }));
        }

        this.state.updateMoves();

        this.world.updateBoard(this.state);
    }
}

export { GameController };