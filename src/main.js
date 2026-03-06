import { World } from './World/World.js';

// create the main function
function main() {
    // get reference to the container element
    const container = document.querySelector('#scene-container');

    // 1. Create an instance of the World App
    const world = new World(container);

    // 2. Render the scene
    world.start();
}

// calling main starts the app
main();