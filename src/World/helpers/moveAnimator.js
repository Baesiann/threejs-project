import { getCoords } from "./getCoords";
import { whoIs } from "../../Game/pieceMoves/pieceMovesUtils/whoIs";
import { drawPiece } from "./drawPiece.js";
import { drawMoveMade } from "./drawMoveMade.js";

// Controller function
function animate(world, move, state, raycaster) {
    // clear all existing highlights
    clearHighlights(world.highlightGroup);

    // draw move made
    drawMarkers(world.highlightGroup, move);

    // Branch to helper animation functions
    if (move.isCastle) {
        animateCastle(world, move, state, raycaster);
    } else if (move.enpassantCapture) {
        animateEnPassant(world, move, state, raycaster);
    } else if (whoIs(state, move.to) !== 0) {
        animateCapture(world, move, state, raycaster);
    } else {
        animateSimple(world, move, state, raycaster);
    }
}

// ANIMATION HELPER FUNCTIONS
// simple moves and promotions
function animateSimple(world, move, state, raycaster) {
    const movingPiece = findMesh(world, move.from);
    if (!movingPiece) return;

    if (move.isPromotion) {
        handlePromotion(world, movingPiece, move, state, raycaster);
    } else {
        // instant set
        const pos = getCoords(move.to);
        movingPiece.position.set(pos.x, pos.y, pos.z);
        movingPiece.userData.square = move.to;
    }
}

// capture moves
function animateCapture(world, move, state, raycaster) {
    const captured = findMesh(world, move.to);
    if (captured) {
        // instant delete
        world.pieceGroup.remove(captured);
        raycaster.remove(captured);
    }
    // After removed, move attacker
    animateSimple(world, move, state, raycaster);
}

// en passant
function animateEnPassant(world, move, state, raycaster) {
    const pawnDir = (move.to > move.from) ? 1 : -1;
    const captureSquare = move.to - (8 * pawnDir);

    const epCapture = findMesh(world, captureSquare);
    if (epCapture) {
        // instant delete
        world.pieceGroup.remove(epCapture);
        raycaster.remove(epCapture);
    }
    // After removed, move attacker
    animateSimple(world, move, state, raycaster);
}

// Castling
function animateCastle(world, move, state, raycaster) {
    // Move King first
    this.animateSimple(world, move, state, raycaster);

    let rookFrom, rookTo;
    if (move.to === 6)  { rookFrom = 7;  rookTo = 5; }  // White Kingside
    if (move.to === 2)  { rookFrom = 0;  rookTo = 3; }  // White Queenside
    if (move.to === 62) { rookFrom = 63; rookTo = 61; } // Black Kingside
    if (move.to === 58) { rookFrom = 56; rookTo = 59; } // Black Queenside

    const rookPiece = findMesh(world, rookFrom);
    if (rookPiece) {
        const rookTarget = getCoords(rookTo);
        // Instant teleport
        rookPiece.position.set(rookTarget.x, rookTarget.y, rookTarget.z);
        rookPiece.userData.square = rookTo;
    }
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