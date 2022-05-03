
const wallLeft = 1, wallTop = 2,
    wallRight = 4, wallBottom = 8;

const walled = wallLeft | wallTop | wallRight | wallBottom;

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


function cell(i, j) {
    return { i, j };
}


function cellInd(width, height, i, j) {
    i = (i + height) % height;
    j = (j + width) % width;

    return i * width + j;
}


function getUnlinkedNeighbors(maze, width, height, c) {
    const cells = [];

    const i = c.i, j = c.j;

    const cLeft = cellInd(width, height, i, j - 1),
        cTop = cellInd(width, height, i - 1, j),
        cRight = cellInd(width, height, i, j + 1),
        cBottom = cellInd(width, height, i + 1, j);

    if (maze[cLeft] === walled) {
        cells.push(cell(i, j - 1));
    }

    if (maze[cTop] === walled) {
        cells.push(cell(i - 1, j));
    }

    if (maze[cRight] === walled) {
        cells.push(cell(i, j + 1));
    }

    if (maze[cBottom] === walled) {
        cells.push(cell(i + 1, j));
    }

    return cells;
}


function linkCells(maze, width, height, c1, c2) {
    const deltaI = c2.i - c1.i,
        deltaJ = c2.j - c1.j;

    const ind1 = cellInd(width, height, c1.i, c1.j),
        ind2 = cellInd(width, height, c2.i, c2.j);

    if (deltaI === 1 || deltaI === 1 - height) {
        maze[ind1] &= ~wallBottom;
        maze[ind2] &= ~wallTop;
    }
    else if (deltaI === -1 || deltaI === height - 1) {
        maze[ind2] &= ~wallBottom;
        maze[ind1] &= ~wallTop;
    }
    else if (deltaJ === 1 || deltaJ === 1 - width) {
        maze[ind1] &= ~wallRight;
        maze[ind2] &= ~wallLeft;
    }
    else {
        maze[ind2] &= ~wallRight;
        maze[ind1] &= ~wallLeft;
    }
}


function getRandomElement(arr) {
    return arr[random(0, arr.length)];
}


function generateMaze(width, height) {
    const maze = new Uint8Array(width * height);

    maze.fill(walled);

    const cells = [cell(random(0, height), random(0, width))];

    do {
        const c = cells[cells.length - 1];
        const neighbors = getUnlinkedNeighbors(maze, width, height, c);

        if (neighbors.length > 0) {
            const c2 = getRandomElement(neighbors);
            linkCells(maze, width, height, c, c2);
            cells.push(c2);
        }
        else {
            cells.pop();
        }

    } while (cells.length > 0);

    return maze;
}


module.exports = {
    generateMaze
};