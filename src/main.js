import { World } from './World/World.js';

// Debugging
import { Board } from "./Game/Board.js";

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

    // Debugging
    const board = new Board();
    board.init();
}

// calling main starts the app
main().catch((err) => {
    console.error(err);
});