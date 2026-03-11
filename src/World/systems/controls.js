import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);

    // damping and auto rotation require controls to be updated each frame
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    // don't pan
    controls.enablePan = false;

    // Restrict vertical viewing
    controls.maxPolarAngle = Math.PI / 2.3;
    controls.minPolarAngle = Math.PI * 0.1;

    // Restrict zooming
    controls.maxDistance = 60;
    controls.minDistance = 10;

    controls.tick = () => controls.update();

    return controls;
}

export { createControls };