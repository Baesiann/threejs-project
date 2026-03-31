import { World } from './World/World.js';
import { GameController } from './Controller/GameController.js';
import { State } from './Game/State.js';
import { loadFromFen } from './Game/loadFromFen.js';

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
    
    const game = new GameController(engine, world, {
        white: 'human',
        black: 'ai'
    });
    world.updateBoard(engine);

    game.start();
}

// calling main starts the app
main().catch((err) => {
    console.error(err);
});