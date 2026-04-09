import { World } from './World/World.js';
import { GameController } from './Controller/GameController.js';
import { State } from './Game/State.js';
import { loadFromFen } from './Game/loadFromFen.js';
import { OnlineProvider } from './Networking/OnlineProvider.js';
import { assign } from 'three/tsl';

const apiKey = import.meta.env.VITE_ABLY_API_KEY;

// create the main function
async function main(mode) {
    // Get chosen color from radio buttons
    const selectedColor = document.querySelector('input[name="user-color"]:checked').value;
    // UI layer on startup
    const uiLayer = document.getElementById('ui-layer');


    // get reference to the container element
    const container = document.querySelector('#scene-container');

    // Create an instance of the World App
    const world = new World(container);

    // complete async tasks
    await world.init();

    // Render the scene
    world.start();

    // Moved implementation to helper to laumch board
    const launchGame = (gameConfig) => {
        const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const {board: board,
            colorToMove: color,
            castling: castling,
            en_passantable: en_passantable,
            halfmove: halfmove,
            fullmove: fullmove} = loadFromFen(startPos);
        
        const engine = new State(board, color, castling, en_passantable, halfmove, fullmove);
        engine.updateMoves();

        const game = new GameController(engine, world, gameConfig);
        world.updateBoard(engine);
        game.start();

        // Hide ui, return game to attach listeners
        if (uiLayer) uiLayer.style.display = "none";
        return game;
    };
    
    // mode branching
    if (mode === 'ai') {
        const config = {
            white: selectedColor === 'white' ? 'human': 'ai',
            black: selectedColor === 'black' ? 'human': 'ai',
            flipper: false
        };
        if (config.white === 'ai') world.controls.rotateCameraToBlack();
        launchGame(config);
    } else if (mode === 'local') {
        launchGame({white: 'human', black: 'human', flipper: true});
    } else if (mode === 'online') {
        // Flag for game starting
        let gameStarted = false;

        // Generate ID if new game, or grab existing
        const roomID = getRoomIDFromURL() || generateNewRoomID();
        const network = new OnlineProvider(apiKey, roomID);


        // Attach listener
        network.onReady((assignedColor) => {
            // Game ready start
            if (gameStarted || !assignedColor) return;
            gameStarted = true;

            // console.log("Game Ready! Starting as:", assignedColor);

            // Hide uiLayer
            uiLayer.innerHTML = '';
            uiLayer.style.display = 'none';

            const config = {
                white: assignedColor === 'white' ? 'human' : 'remote',
                black: assignedColor === 'black' ? 'human' : 'remote',
                flipper: false
            };

            if (assignedColor === 'black') world.controls.rotateCameraToBlack();

            const game = launchGame(config);
            
            // Connect networking to the game instance
            network.onMoveReceived((move) => game.movePiece(move));

            // onMove hook for the GameController
            game.onMoveMade = (move) => network.sendMove(move);
        });

        await network.connect();

        // UI Feedback (only if white)
        if (network.myColor === 'white') {
            uiLayer.innerHTML = '';
            const status = document.createElement('div');
            status.id = "status-message";
            status.innerText = "Waiting for opponent... Share the URL!"
            uiLayer.appendChild(status);
        }
    }
}

// Menu buttons
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        main(mode).catch(err => console.error("Match failed to start:", err));
    });
});

// Room management
function getRoomIDFromURL() {
    return new URLSearchParams(window.location.search).get('room');
}

function generateNewRoomID() {
    const id = Math.random().toString(36).substring(2, 9);
    window.history.pushState({}, '', `?room=${id}`);
    return id;
}

// Auto connect
const roomID = getRoomIDFromURL();
if (roomID) {
    // console.log("Room ID detected, auto-connecting to room: ", roomID);
    // pass 'online' to skip the menu
    main('online').catch(err => console.error("Auto-connect failed: ", err));
}