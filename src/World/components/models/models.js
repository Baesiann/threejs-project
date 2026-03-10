import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { setupModel } from "./setupModel.js";

async function loadModels() {
    const loader = new GLTFLoader();

    const [boardData,
        blackPawnData,
        blackRookData,
        blackKnightData,
        blackBishopData,
        blackQueenData,
        blackKingData,
        whitePawnData,
        whiteRookData,
        whiteKnightData,
        whiteBishopData,
        whiteQueenData,
        whiteKingData
    ] = await Promise.all([
        loader.loadAsync('assets/chess_board.glb'),

        loader.loadAsync('assets/black_pawn.glb'),
        loader.loadAsync('assets/black_rook.glb'),
        loader.loadAsync('assets/black_knight.glb'),
        loader.loadAsync('assets/black_bishop.glb'),
        loader.loadAsync('assets/black_queen.glb'),
        loader.loadAsync('assets/black_king.glb'),

        loader.loadAsync('assets/white_pawn.glb'),
        loader.loadAsync('assets/white_rook.glb'),
        loader.loadAsync('assets/white_knight.glb'),
        loader.loadAsync('assets/white_bishop.glb'),
        loader.loadAsync('assets/white_queen.glb'),
        loader.loadAsync('assets/white_king.glb'),
    ]);

    console.log('board:', boardData, blackRookData);

    const board = setupModel(boardData);

    const blackPawn = setupModel(blackPawnData);
    const blackRook = setupModel(blackRookData);
    const blackKnight = setupModel(blackKnightData);
    const blackBishop = setupModel(blackBishopData);
    const blackQueen = setupModel(blackQueenData);
    const blackKing = setupModel(blackKingData);

    const whitePawn = setupModel(whitePawnData);
    const whiteRook = setupModel(whiteRookData);
    const whiteKnight = setupModel(whiteKnightData);
    const whiteBishop = setupModel(whiteBishopData);
    const whiteQueen = setupModel(whiteQueenData);
    const whiteKing = setupModel(whiteKingData);

    return { 
        board,
        blackPawn,
        blackRook,
        blackKnight,
        blackBishop,
        blackKnight,
        blackQueen,
        blackKing,
        whitePawn,
        whiteRook,
        whiteKnight,
        whiteBishop,
        whiteQueen,
        whiteKing,
    };
}

export { loadModels };