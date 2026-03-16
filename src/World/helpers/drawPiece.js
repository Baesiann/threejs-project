// helper to add pieces to the scene
// default parameter needed for knight
// offset in squares: 1.08
import { Color, MeshPhysicalMaterial, Group } from "three";

// aesthetics
// https://stackoverflow.com/questions/63663984/how-can-i-add-color-or-texture-to-a-model-i-load-from-a-glb-file
var blackMat = new MeshPhysicalMaterial({
    color: 0x444444, // Dark wood/plastic
    roughness: 0.4, 
    metalness: 0.2,
    flatShading: true,
});

var whiteMat = new MeshPhysicalMaterial();
    whiteMat.color = new Color(0x868c7a);
    whiteMat.emissive = new Color(0x000000);
    whiteMat.iridescence = 0.5;
    whiteMat.roughness = 0.5;


function drawPiece(group, raycaster, pieceSource, square, state, rotate=false) {
    // clone the piece to be used
    const piece = pieceSource.clone();

    // obtain location of square
    let row = Math.floor(square/8);
    let col = (square % 8);
    // console.log(row, col);

    // position every piece in reference to a1's position
    const origin = 3.78;
    const squareOffset = 1.08;

    const isBlack = state.Squares[square] > 16;
    const activeMat = isBlack ? blackMat : whiteMat;

    piece.traverse((child) => {
        if (child.isMesh) {
            // Fix shading on jagged geometry
            child.geometry.computeVertexNormals();
            
            child.material = activeMat;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    piece.position.set(-origin + col * squareOffset, 0, origin - row *squareOffset);

    // rotate the black knight in the right direction
    if (rotate) {
        piece.rotation.y = Math.PI;
    }

    group.add(piece);
    raycaster.add(piece);

    const color = (isBlack) ? 16 : 8;

    // console.log(piece.userData);
    piece.userData = {
        square: square,
        piece: state.Squares[square],
        color: color,
        moves: state.getLegalMoves(square),
        type: 'piece'
    };

    // console.log(piece);
}

export { drawPiece };
