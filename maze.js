
const wallLeft = 1, wallTop = 2,
    wallRight = 4, wallBottom = 8,
    visited = 16;

const walled = wallLeft | wallTop | wallRight | wallBottom,
    walledVisited = walled | visited;

function generateMaze(width, height) {
    const maze = new Uint8Array(width * height);
    maze[0] = walled;
    maze[2] = walled;

    return maze;
}


module.exports = {
    generateMaze
};