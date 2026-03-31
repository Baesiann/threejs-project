// draws a green square where a piece came from and landed

import { Mesh, MeshBasicMaterial, BoxGeometry } from 'three';

const geometry = new BoxGeometry(1.08, 0.2, 1.08);
const material = new MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.4  // Adjust this to make it a subtle glow
    });

function drawMoveMade(group, square) {
    // square properties
    geometry.computeBoundingBox();
    
    const highlight = new Mesh(geometry, material);

    // obtain location of square
    let row = Math.floor(square/8);
    let col = (square % 8);

    // position square in referenct to a1
    const origin = 3.78;
    const squareOffset = 1.08;

    // add square and position
    group.add(highlight);
    highlight.position.set(-origin + col * squareOffset, 0.05, origin - row * squareOffset);
}

export { drawMoveMade };