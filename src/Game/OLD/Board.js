/**
 * State storage
 * 
 * store a board with objects
 * 
 * board.getPiece(square)
 * board.setPiece(square, piece)
 * board.movePiece(from, to)
 */

import { loadFromFen } from "./loadFromFen.js";
import { Piece } from "./Piece.js";
import { saveToFen } from "./saveToFen.js";
import { generateMoves } from "./MoveGenerator.js";
// import { validateMoves } from "./moveValidation.js";

// Store a dictionary to convert char to int
const rankDict = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7
}

class Board {
    constructor() {
        const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const testPos = "8/8/5k2/5r2/8/5BN1/5K2/8 w - - 0 1";
        
        // Initialize starting position from fen
        this.Squares = loadFromFen(testPos).board;
        // Starting last part of fen is constant
        this.colorToMove = Piece.White;
        this.castling = {
            White_Kingside: false,
            White_Queenside: false,
            Black_Kingside: false,
            Black_Queenside: false
        };
        this.en_passantable = "-";
        this.halfmove = 0;
        this.fullmove = 1;
        this.moves = generateMoves(this.Squares, this.colorToMove, this.castling, this.en_passantable);
        this.legalMoves = this.validateMoves(this.moves, this.Squares, this.colorToMove, this.en_passantable);
    }

    validateMoves(moves, board, colorToMove, en_passantable, castling) {
        var legalMoves = [];
        // for each piece
        for (let i = 0; i < moves.length; i++) {
            // for each possible move
            for (let j = 0; j < moves[i].length; j++) {
                // check if the King can be taken by the opposite color
                if (colorToMove === Piece.White) {
                    // save index of white king
                    let kingPos = board.indexOf(9);
                    // make the move
                    let tempBoard = this.movePiece(moves[i][j].from, moves[i][j].to);
                    // search if any of the black moves can take the white king
                    let tempMoves = generateMoves(tempBoard, Piece.Black, this.castling, this.en_passantable);
                    console.log(tempMoves);
                    for (let x = 0; x < tempMoves.length; x++){
                        for (let y = 0; y < tempMoves[x].length; y++) {
                            if (tempMoves[x][y].to !== kingPos) {
                                console.log(moves[i][j]);
                                legalMoves.push(moves[i][j]);
                            }
                        }
                    }
                } else {

                }
            }
        }

        return legalMoves;
    }

    movePiece(from, to) {
        let board = this.Squares;
        board[to] = board[from];
        board[from] = 0;

        return board;
    }

    // getIndex(square) {
    //     const rank_file = square.split("");
    //     // console.log(rank_file);
    //     // console.log(rankDict[rank_file[0]]);
    //     let column = rankDict[rank_file[0]];
    //     let row = parseInt(rank_file[1]);
    //     // console.log(column, row);
    //     // console.log(column + (row - 1) * 8);
    //     // console.log(this.Squares[column + (row - 1) * 8]);
    //     return column + (row - 1) * 8;
    // }

    // // example: "a4"
    // getPiece(square) {
    //     return this.Squares[this.getIndex(square)];
    // }

    // // example: ("a4", Piece.color, Piece.Type)
    // // Sets a piece on a square with color and type
    // setPiece(square, pieceColor, pieceType) {
    //     const rank_file = square.split("");
    //     let column = this.rankDict[rank_file[0]];
    //     let row = parseInt(rank_file[1]);
    
    //     // console.log(column, row);
    //     // console.log(column + (row - 1) * 8);
    //     this.Squares[column + (row - 1) * 8] = pieceColor | pieceType;

    //     return this.Squares;
    // }

    // // Sets a piece on a square by using it's int ID
    // setPieceByID(square, pieceInt) {
    //     const rank_file = square.split("");
    //     let column = this.rankDict[rank_file[0]];
    //     let row = parseInt(rank_file[1]);
    
    //     // console.log(column, row);
    //     // console.log(column + (row - 1) * 8);
    //     this.Squares[column + (row - 1) * 8] = pieceInt;

    //     return this.Squares;
    // }

    // // example: ("a2", "a4")
    // movePiece(startSquare, endSquare) {
    //     let pieceMoved = this.getPiece(startSquare);
    //     this.setPieceByID(startSquare, 0);
    //     this.setPieceByID(endSquare, pieceMoved);

    //     return this.Squares;
    // }

    init() {
        // // Convert to 2d array for viewing
        console.log(this.Squares);
        // // console.log(this.getPiece("h1"));
        // // console.log(this.setPiece("a4", Piece.Black, Piece.Bishop));
        // console.log(this.movePiece("a2", "a4"));
        // var viewBoard = Array.from({ length: 8 }, () => new Array(8));
        // let board_index = 0;
        // for (let i = 0; i < 8; i++) {
        //     for (let j = 0; j < 8; j++) {
        //         viewBoard[i][j] = board_index;
        //         board_index++;
        //     }
        // }
        // console.log(viewBoard);
        console.log(this.legalMoves);
        // console.log(whoIs(this.Squares, 20, Piece.Black));
        // console.log(this.en_passantable);
        // console.log(loadFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1"));

        // console.log(saveToFen(this.Squares, this.colorToMove, this.castling, "a4", this.halfmove, this.fullmove));
    }
}

export { Board }