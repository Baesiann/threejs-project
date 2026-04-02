import { World } from './World/World.js';
import { GameController } from './Controller/GameController.js';
import { State } from './Game/State.js';
import { loadFromFen } from './Game/loadFromFen.js';

// create the main function
async function main(mode) {
    // Get chosen color from radio buttons
    const selectedColor = document.querySelector('input[name="user-color"]:checked').value;
    // Hide the UI layer
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) uiLayer.style.display = "none";

    // get reference to the container element
    const container = document.querySelector('#scene-container');

    // Create an instance of the World App
    const world = new World(container);

    // complete async tasks
    await world.init();

    // Render the scene
    world.start();

    // Game implementation
    // initialize position
    const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const {board: board,
        colorToMove: color,
        castling: castling,
        en_passantable: en_passantable,
        halfmove: halfmove,
        fullmove: fullmove} = loadFromFen(startPos);
    
    const engine = new State(board, color, castling, en_passantable, halfmove, fullmove);
    engine.updateMoves();

    // setup config
    let config = { white: 'human', black: 'human', flipper: true };
    if (mode === 'ai') {
        config.flipper = false;
        if (selectedColor === 'white') {
            config.white = 'human';
            config.black = 'ai';
        } else {
            config.white = 'ai';
            config.black = 'human';
            // Start the camera on the black side
            world.controls.rotateCameraToBlack(); 
        }
    }
    
    const game = new GameController(engine, world, config);
    world.updateBoard(engine);

    game.start();
}

// Menu buttons
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        main(mode).catch(err => console.error("Match failed to start:", err));
    });
});
