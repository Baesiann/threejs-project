import { WebGLRenderer } from 'three';

function createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });

    // enable physically correct lighting model
    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };