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

class Board {
    constructor() {
        const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"
        // Initialize starting position from fen
        this.Squares = loadFromFen(startPos);

        // Store a dictionary to convert char to int
        this.rankDict = {
            'a': 0,
            'b': 1,
            'c': 2,
            'd': 3,
            'e': 4,
            'f': 5,
            'g': 6,
            'h': 7
        }
    }

    // example: "a4"
    getPiece(square) {
        const rank_file = square.split("");
        let column = this.rankDict[rank_file[0]];
        let row = parseInt(rank_file[1]);
        console.log(column, row);
        console.log(column + (row - 1) * 8);
        return this.Squares[column + (row - 1) * 8];
    }

    // example: ("a4", Piece.color, Piece.Type)
    // Sets a piece on a square with color and type
    setPiece(square, pieceColor, pieceType) {
        const rank_file = square.split("");
        let column = this.rankDict[rank_file[0]];
        let row = parseInt(rank_file[1]);
    
        // console.log(column, row);
        // console.log(column + (row - 1) * 8);
        this.Squares[column + (row - 1) * 8] = pieceColor | pieceType;

        return this.Squares;
    }

    // Sets a piece on a square by using it's int ID
    setPieceByID(square, pieceInt) {
        const rank_file = square.split("");
        let column = this.rankDict[rank_file[0]];
        let row = parseInt(rank_file[1]);
    
        // console.log(column, row);
        // console.log(column + (row - 1) * 8);
        this.Squares[column + (row - 1) * 8] = pieceInt;

        return this.Squares;
    }

    // example: ("a2", "a4")
    movePiece(startSquare, endSquare) {
        let pieceMoved = this.getPiece(startSquare);
        this.setPieceByID(startSquare, 0);
        this.setPieceByID(endSquare, pieceMoved);

        return this.Squares;
    }

    // init() {
    //     // Convert to 2d array for viewing
    //     console.log(this.Squares);
    //     // console.log(this.getPiece("h1"));
    //     // console.log(this.setPiece("a4", Piece.Black, Piece.Bishop));
    //     console.log(this.movePiece("a2", "a4"));
    //     var viewBoard = Array.from({ length: 8 }, () => new Array(8));
    //     let board_index = 0;
    //     for (let i = 0; i < 8; i++) {
    //         for (let j = 0; j < 8; j++) {
    //             viewBoard[i][j] = this.Squares[board_index];
    //             board_index++;
    //         }
    //     }
    //     console.log(viewBoard);
    // }
}

export { Board }