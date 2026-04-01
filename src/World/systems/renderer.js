import { WebGLRenderer } from 'three';

function createRenderer() {
    const renderer = new WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

    // enable physically correct lighting model
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;

    return renderer;
}

export { createRenderer };