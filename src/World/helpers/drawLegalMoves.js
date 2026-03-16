// draws a sphere where the clicked piece can go

import { Mesh, MeshBasicMaterial, SphereGeometry } from "three"

function drawLegalMoves(group, raycaster, square) {
    // indicator properties
    const geometry = new SphereGeometry(0.4, 16, 8);
    geometry.computeBoundingSphere();
    const material = new MeshBasicMaterial( {color: 'red'} );
    const indicator = new Mesh(geometry, material);

    // obtain location of square
    let row = Math.floor(square/8);
    let col = (square % 8);

    // position every indicator in reference to a1's position
    const origin = 3.78;
    const squareOffset = 1.08;

    // add indicator, position it, and make it clickable
    group.add(indicator);
    indicator.position.set(-origin + col * squareOffset, 0, origin - row *squareOffset);
    raycaster.add(indicator);

    // add properties to the indicator
    indicator.userData = {
        square: square,
        name: "indicator"
    };

    // console.log(indicator);
}

export { drawLegalMoves };