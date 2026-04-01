import { getCoords } from "./getCoords";
import { whoIs } from "../../Game/pieceMoves/pieceMovesUtils/whoIs";
import { drawPiece } from "./drawPiece.js";
import { drawMoveMade } from "./drawMoveMade.js";
import { gsap } from "gsap";

// Controller function
function animate(world, move, state, raycaster, onComplete) {
    // clear all existing highlights
    clearHighlights(world.highlightGroup);

    // draw move made
    drawMarkers(world.highlightGroup, move);

    // Branch to helper animation functions
    if (move.isCastle) {
        animateCastle(world, move, state, raycaster, onComplete);
    } else if (move.enpassantCapture) {
        animateEnPassant(world, move, state, raycaster, onComplete);
    } else if (whoIs(state, move.to) !== 0) {
        animateCapture(world, move, state, raycaster, onComplete);
    } else {
        animateSimple(world, move, state, raycaster, onComplete);
    }
}

// ANIMATION HELPER FUNCTIONS
// simple moves and promotions
function animateSimple(world, move, state, raycaster, onComplete, jumpHeight=1.2) {
    const movingPiece = findMesh(world, move.from);
    if (!movingPiece) return;

    const pieceType = state.Squares[move.from] & 0x7;
    if (pieceType === 3) jumpHeight = 1.6;

    const pos = getCoords(move.to);
    const duration = 0.6;

    // Sync through timeline
    const tl = gsap.timeline({
        onComplete: () => {
            movingPiece.userData.square = move.to;
            if (move.isPromotion) {
                handlePromotion(world, movingPiece, move, state, raycaster);
            }
            if (onComplete) onComplete();
        }
    });

    // horizontal movement
    tl.to(movingPiece.position, {
        x: pos.x,
        z: pos.z,
        duration: duration,
        ease: "power2.inOut",
    }, 0);  // Starts at time 0

    // vertical movement (lift)
    tl.to(movingPiece.position, {
        y: jumpHeight,
        duration: duration / 2,
        ease: "power1.out",
    }, 0);  // Starts at time 0

    // vertical movement (down)
    tl.to(movingPiece.position, {
        y: 0,
        duration: duration/2,
        ease: "power1.in"
    }, duration/2);     // starts halfway through
}

// capture moves
function animateCapture(world, move, state, raycaster, onComplete) {
    const captured = findMesh(world, move.to);
    if (captured) {
        // instant delete
        // world.pieceGroup.remove(captured);
        // raycaster.remove(captured);

        // SINK
        gsap.to(captured.position, {
            y: -1,
            duration: 0.2,
            onComplete: () => {
                world.pieceGroup.remove(captured);
                raycaster.remove(captured);
            }
        });
    }
    // After removed, wait before moving attacker
    setTimeout(() => {
        animateSimple(world, move, state, raycaster, onComplete);
    }, 100);
}

// en passant
function animateEnPassant(world, move, state, raycaster, onComplete) {
    const pawnDir = (move.to > move.from) ? 1 : -1;
    const captureSquare = move.to - (8 * pawnDir);

    const epCapture = findMesh(world, captureSquare);
    if (epCapture) {
        // instant delete
        world.pieceGroup.remove(epCapture);
        raycaster.remove(epCapture);
    }
    // After removed, move attacker
    animateSimple(world, move, state, raycaster, onComplete);
}

// Castling
function animateCastle(world, move, state, raycaster, onComplete) {
    // Move King first without passing callback
    animateSimple(world, move, state, raycaster, () => {
        let rookFrom, rookTo;
        if (move.to === 6)  { rookFrom = 7;  rookTo = 5; }  // White Kingside
        if (move.to === 2)  { rookFrom = 0;  rookTo = 3; }  // White Queenside
        if (move.to === 62) { rookFrom = 63; rookTo = 61; } // Black Kingside
        if (move.to === 58) { rookFrom = 56; rookTo = 59; } // Black Queenside

        const rookPiece = findMesh(world, rookFrom);
        if (rookPiece) {
            const rookTarget = getCoords(rookTo);
            
            // Animate rook
            animateSimple(world, { from: rookFrom, to: rookTo }, state, raycaster, onComplete, 2.5);
        }
    });
}

// GENERAL HELPER FUNCTIONS
function findMesh(world, square) {
    return world.pieceGroup.children.find(c => c.userData?.square === square);
}

function handlePromotion(world, oldMesh, move, state, raycaster) {
    // Delete oldMesh (pawn) instantly
    world.pieceGroup.remove(oldMesh);
    raycaster.remove(oldMesh);

    const model = world.pieceDict[move.piece];
    if (model) {
        const isBlackKnight = (move.piece === 19);
        // instantly drawn in
        drawPiece(world.pieceGroup, raycaster, model, move.to, state, isBlackKnight);
    }
}

function clearHighlights(group) {
    while(group.children.length > 0) group.remove(group.children[0]);
}

function drawMarkers(group, move) {
    drawMoveMade(group, move.from);
    drawMoveMade(group, move.to);
}

export { animate };