
export class Maze {
    grid;
    data;
    width;
    height;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = new Uint8Array(width * height);
        this.data = new Uint8Array(width * height * 2);
    }

    convertGrid() {
        const wallLeft = 1, wallTop = 2,
            wallRight = 4, wallBottom = 8;

        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                const cell = this.grid[i * this.width + j];

                const hasLeftWall = cell & wallLeft,
                    hasTopWall = cell & wallTop;

                this.setData(i * 2 + 1, j, hasLeftWall);
                this.setData(i * 2, j, hasTopWall);
            }
        }
    }

    setData(i, j, value) {
        this.data[i * this.width + j] = value ? 255 : 0;
    }

    cellInd(i, j) {
        return i * this.width + j;
    }

    canMove(i1, j1, i2, j2) {
        const wallLeft = 1, wallTop = 2,
            wallRight = 4, wallBottom = 8;

        const deltaI = i2 - i1,
            deltaJ = j2 - j1;

        const ind1 = this.cellInd(i1, j1);

        if (deltaI === 1 || deltaI === 1 - this.height) {
            return (this.grid[ind1] & wallBottom) === 0;
        }
        else if (deltaI === -1 || deltaI === this.height - 1) {
            return (this.grid[ind1] & wallTop) === 0;
        }
        else if (deltaJ === 1 || deltaJ === 1 - this.width) {
            return (this.grid[ind1] & wallRight) === 0;
        }
        else {
            return (this.grid[ind1] & wallLeft) === 0;
        }
    }
}