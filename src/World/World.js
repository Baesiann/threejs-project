import { createCamera } from './components/camera.js';
import { loadModels } from './components/models/models.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

// These variables are module-scoped
// They cannot be accessed from outside the module
let camera;
let renderer;
let scene;
let loop;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

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