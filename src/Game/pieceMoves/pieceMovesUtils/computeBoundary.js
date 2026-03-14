// Calculates number of squares to edge of the board
// store it as a module global for easy lookup
function computeBoundary() {
    const numSquaresToEdge = [];
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            let numNorth = 7 - row;
            let numSouth = row;
            let numWest = column;
            let numEast = 7 - column;

            const squareIndex = row * 8 + column;

            numSquaresToEdge[squareIndex] = [
                numNorth,
                numSouth,
                numEast,
                numWest,
                Math.min(numNorth, numEast),
                Math.min(numSouth, numWest),
                Math.min(numNorth, numWest),
                Math.min(numSouth, numEast),
            ];
        }
    }

    return numSquaresToEdge;
}

export { computeBoundary };