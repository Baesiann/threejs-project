import { createCamera } from './components/camera.js';
import { loadModels } from './components/models/models.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { createRaycaster } from './systems/raycaster.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

import { drawPiece } from './helpers/drawPiece.js';
import { drawLegalMoves } from './helpers/drawLegalMoves.js';

// These variables are module-scoped
// They cannot be accessed from outside the module
let camera;
let renderer;
let scene;
let loop;
let raycaster;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        raycaster = new createRaycaster(camera, scene, renderer);

        const controls = createControls(camera, renderer.domElement);
        const { ambientLight, mainLight } = createLights();

        loop.updatables.push(controls);
        scene.add(ambientLight, mainLight);

        const resizer = new Resizer(container, camera, renderer);
    }

    async init() {
        const {
            board,
            blackPawn,
            blackRook,
            blackKnight,
            blackBishop,
            blackQueen,
            blackKing,
            whitePawn,
            whiteRook,
            whiteKnight,
            whiteBishop,
            whiteQueen,
            whiteKing
        } = await loadModels();

        this.board = board;
        this.blackPawn = blackPawn;
        this.blackRook = blackRook;
        this.blackKnight = blackKnight;
        this.blackBishop = blackBishop;
        this.blackQueen = blackQueen;
        this.blackKing = blackKing;
        this.whitePawn = whitePawn;
        this.whiteRook = whiteRook;
        this.whiteKnight = whiteKnight;
        this.whiteBishop = whiteBishop;
        this.whiteQueen = whiteQueen;
        this.whiteKing = whiteKing;

        this.board.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        scene.add(this.board);

        // lower board so pieces sit on top of board
        this.board.position.set(0, -0.3, 0);
    }

    updateBoard(state) {
        // draw each piece to the board
        for (let i = 0; i < state.Squares.length; i++) {
            switch(state.Squares[i]) {
                case 0:
                    break;
                case 18:
                    drawPiece(scene, raycaster, this.blackPawn, i, state);
                    break;
                case 21:
                    drawPiece(scene, raycaster, this.blackRook, i, state);
                    break;
                case 19:
                    drawPiece(scene, raycaster, this.blackKnight, i, state, true);
                    break;
                case 20:
                    drawPiece(scene, raycaster, this.blackBishop, i, state);
                    break;
                case 22:
                    drawPiece(scene, raycaster, this.blackQueen, i, state);
                    break;
                case 17:
                    drawPiece(scene, raycaster, this.blackKing, i, state);
                    break;
                case 10:
                    drawPiece(scene, raycaster, this.whitePawn, i, state);
                    break;
                case 13:
                    drawPiece(scene, raycaster, this.whiteRook, i, state);
                    break;
                case 11:
                    drawPiece(scene, raycaster, this.whiteKnight, i, state);
                    break;
                case 12:
                    drawPiece(scene, raycaster, this.whiteBishop, i, state);
                    break;
                case 14:
                    drawPiece(scene, raycaster, this.whiteQueen, i, state);
                    break;
                case 9:
                    drawPiece(scene, raycaster, this.whiteKing, i, state);
                    break;
            }
        }
    }

    highlightSquares(moves) {
        // idk man put a red square where things can go
        // console.log(moves);
        for (let i = 0; i < moves.length; i++) {
            // console.log(moves[i]);
            drawLegalMoves(scene, raycaster, moves[i].to);
        }
    }

    render() {
        // draw a single frame
        renderer.render(scene, camera);
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };