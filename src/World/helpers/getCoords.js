function getCoords(squareIndex) {
    const origin = 3.78;
    const squareOffset = 1.08;
    const row = Math.floor(squareIndex / 8);
    const col = squareIndex % 8;

    return {
        x: -origin + col * squareOffset,
        y: 0,
        z: origin - row * squareOffset
    };
}

export { getCoords };