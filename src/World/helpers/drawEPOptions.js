// helper to draw enpassent options
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
    whiteMat.emissive = new Color(0x222222);
    whiteMat.iridescence = 0.3;
    whiteMat.metalness = 0.1;


function drawEPOptions(group, raycaster, pieceSource, color, camera, index, type, rotate=false) {
    // clone the piece to be used
    const piece = pieceSource.clone();
    piece.userData.promotionType = type;

    const isWhite = (color === 8);
    const activeMat = isWhite ? whiteMat : blackMat;

    piece.traverse((child) => {
        if (child.isMesh) {
            // Fix shading on jagged geometry
            child.geometry.computeVertexNormals();
            
            child.material = activeMat;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Offset
    const spacing = 0.5;

    // Position relative to camera
    piece.position.set((index - 1.5) * spacing, 0.4, -3);
    piece.scale.set(0.2, 0.2, 0.2);
    piece.rotation.x = 0.3; // Slight tilt up

    if (rotate) {
        piece.rotation.y = Math.PI;
    }

    group.add(piece);
    raycaster.add(piece);

    // console.log(piece);
}

export { drawEPOptions };
