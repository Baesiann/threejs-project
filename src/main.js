import { World } from './World/World.js';

// create the main function
async function main() {
    // get reference to the container element
    const container = document.querySelector('#scene-container');

    // Create an instance of the World App
    const world = new World(container);

    // complete async tasks
    await world.init();

    // Render the scene
    world.start();
}

// calling main starts the app
main().catch((err) => {
    console.error(err);
});