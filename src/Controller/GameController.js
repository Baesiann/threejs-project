import { applyMove } from "../Game/applyMove";

class GameController {
    constructor(enginerState, world) {
        this.state = enginerState;
        this.world = world;

        this.selectedPiece;

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
        console.log(this.State);
        this.world.updateBoard(this.state);
    }

    selectPiece(userData) {
        console.log("PIECE USER DATA: ", userData);
        // Highlight legal moves when user clicks piece

        let moves = this.state.getLegalMoves(userData.square);

        this.selectedPiece = userData.square;
        console.log("index selected: ", this.selectedPiece);

        this.world.highlightSquares(moves);
        
    }

    selectIndicator(userData) {
        console.log("INDICATOR USER DATA: ", userData);
        this.world.highlightSquares([]);
        
        // get the full move
        console.log(this.state.moves);
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
        this.state = applyMove(this.state, move);

        this.state.updateMoves();

        console.log(this.state);

        this.world.updateBoard(this.state);
    }
}

export { GameController };