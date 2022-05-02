
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

                const hasLeftWall = this.data[i * this.width + j] & wallLeft,
                    hasTopWall = this.data[i * this.height + j] & wallTop;

                this.setData(i * 2, j, hasLeftWall);
                this.setData(i * 2 + 1, j, hasTopWall);
            }
        }
    }

    setData(i, j, value) {
        this.data[i * this.width + j] = value ? 255 : 0;
    }
}