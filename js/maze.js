
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

    }

    setData(i, j, value) {
        this.data[i * this.width + j] = value ? 255 : 0;
    }
}