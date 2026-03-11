import { createCamera } from './components/camera.js';
import { loadModels } from './components/models/models.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { createRaycaster } from './systems/raycaster.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

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
        scene.add(board);

        // lower board so pieces sit on top of board
        board.position.set(0, -0.3, 0);

        // Add pieces for testing
        scene.add(blackPawn);
        blackPawn.position.set(1.65, 0, 1.65);
        raycaster.add(blackPawn);
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