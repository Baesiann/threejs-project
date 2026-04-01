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

    // Animation helpers
    let targetRotation = 0;
    let rotating = false;

    controls.rotateCameraToBlack = () => {
        targetRotation = Math.PI;
        controls.enabled = false;
        rotating = true;
    }

    controls.rotateCameraToWhite = () => {
        targetRotation = 0;
        controls.enabled = false;
        rotating = true;
    };
    
    // Listens for the moveMade event
    window.addEventListener("moveMade", (event) => {
        const colorToMove = event.detail;
        setTimeout(() => {
            if (colorToMove === 16) {
                // console.log("black to move");
                controls.rotateCameraToBlack();
            } else {
                // console.log("white to move");
                controls.rotateCameraToWhite();
            }
        }, 200);
    });

    // https://en.wikipedia.org/wiki/Spherical_coordinate_system

    // Helper to find shortest path for rotation
    function shortestAngleDiff(current, target) {
        let diff = target - current;

        // wrap between -π and π
        while (diff < -Math.PI) diff += 2 * Math.PI;
        while (diff > Math.PI) diff -= 2 * Math.PI;

        return diff;
    }

    controls.tick = (delta) => {
        
        if (rotating) {

            const angle = Math.atan2(camera.position.x, camera.position.z);

            const radius = Math.sqrt(
                camera.position.x ** 2 +
                camera.position.z ** 2
            );

            const diff = shortestAngleDiff(angle, targetRotation);

            // lerp
            const rotationSpeed = 3.0;
            const step = Math.sign(diff) * Math.min(Math.abs(diff), rotationSpeed * delta);

            camera.position.x = radius * Math.sin(angle + step);
            camera.position.z = radius * Math.cos(angle + step);

            if (Math.abs(diff) < 0.01) {
                camera.position.x = radius * Math.sin(targetRotation);
                camera.position.z = radius * Math.cos(targetRotation);
                rotating = false;
                controls.enabled = true;
            }
        }

        controls.update();
    }

    return controls;
}

export { createControls };