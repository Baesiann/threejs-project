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
import { drawEPOptions } from './helpers/drawEPOptions.js';
import { Group } from 'three';

import { Vector3 } from 'three';

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

        this.epGroup = new Group();
        this.epGroup.name = 'EPoptions';

        scene.add(camera);
        camera.add(this.epGroup);

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

        this.pieceGroup = new Group();
        this.pieceGroup.name = 'Pieces';
        this.indicatorGroup = new Group();
        this.indicatorGroup.name = 'Indicators';
        scene.add(this.pieceGroup);
        scene.add(this.indicatorGroup);

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
        // console.log("updating with state: ", state);
        // clear all existing pieces
        while(this.pieceGroup.children.length > 0) { 
            raycaster.remove(this.pieceGroup.children[0]);
            this.pieceGroup.remove(this.pieceGroup.children[0]); 
        }

        // int to model conversion
        const pieceDict = {
            18: this.blackPawn,
            21: this.blackRook,
            19: this.blackKnight,
            20: this.blackBishop,
            22: this.blackQueen,
            17: this.blackKing,
            10: this.whitePawn,
            13: this.whiteRook,
            11: this.whiteKnight,
            12: this.whiteBishop, 
            14: this.whiteQueen,
            9: this.whiteKing
        };

        // draw each piece to the group
        state.Squares.forEach((pieceValue, i) => {
            if (pieceValue !== 0) {
                const model = pieceDict[pieceValue];
                // rotate black knight
                if (pieceValue === 19 && model) {
                    drawPiece(this.pieceGroup, raycaster, model, i, state, true);
                } else if (model) {
                    drawPiece(this.pieceGroup, raycaster, model, i, state);
                }
            }
        });
    }

    highlightSquares(moves) {
        // idk man put a red square where things can go
        // clear board from previous legal moves
        while(this.indicatorGroup.children.length > 0) { 
            raycaster.remove(this.indicatorGroup.children[0]);
            this.indicatorGroup.remove(this.indicatorGroup.children[0]);
        }
       
        // console.log(moves);
        for (let i = 0; i < moves.length; i++) {
            // console.log(moves[i]);
            drawLegalMoves(this.indicatorGroup, raycaster, moves[i].to);
        }
    }

    triggerPromotion(color) {
        // Disable ability to click on other pieces
        // Store current interactables
        this.savedInteractables = [...raycaster.interactable];
        raycaster.interactable = [];

        if (color === 8) {
            // draw white pieces to promote
            drawEPOptions(this.epGroup, raycaster, this.whiteQueen, 8, camera, 0, 14);
            drawEPOptions(this.epGroup, raycaster, this.whiteRook, 8, camera, 1, 13);
            drawEPOptions(this.epGroup, raycaster, this.whiteBishop, 8, camera, 2, 12);
            drawEPOptions(this.epGroup, raycaster, this.whiteKnight, 8, camera, 3, 11, true);
        } else {
            // draw black pieces to promote
            drawEPOptions(this.epGroup, raycaster, this.blackQueen, 16, camera, 0, 22);
            drawEPOptions(this.epGroup, raycaster, this.blackRook, 16, camera, 1, 21);
            drawEPOptions(this.epGroup, raycaster, this.blackBishop, 16, camera, 2, 20);
            drawEPOptions(this.epGroup, raycaster, this.blackKnight, 16, camera, 3, 19, true);
        }
    }

    clearPromotionUI() {
        // Empty the group
        while(this.epGroup.children.length > 0) {
            this.epGroup.remove(this.epGroup.children[0]);
        }
        // Restore the board pieces to the raycaster
        raycaster.interactable = this.savedInteractables;
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