import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);

    // damping and auto rotation require controls to be updated each frame
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    controls.tick = () => controls.update();

    return controls;
}

export { createControls };