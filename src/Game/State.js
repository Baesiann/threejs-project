// Purpose of this file is to store and update game state
// A state object should be passed in and returned to various functions

class State {
    constructor(squares, color, castling, en_passantable, halfmove, fullmove) {
        this.Squares = squares;
        this.colorToMove = color;
        this.castling = castling;
        this.en_passantable = en_passantable;
        this.halfmove = halfmove;
        this.fullmove = fullmove;
    }

    makeMove(from, to) {
        this.Squares[to] = this.Squares[from];
        this.Squares[from] = 0;

        return State;
    }

    //use for testing
    init() {
        const board = new State();
        console.log(board);
    }
}

export { State };