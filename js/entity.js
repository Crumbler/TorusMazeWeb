
import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { m4 } from '/twgl.js';

export class Entity {
    maze;
    i;
    j;
    pos;
    mat;

    constructor(maze, i = 0, j = 0) {
        this.maze = maze;
        this.i = i;
        this.j = j;
        this.mat = m4.identity();

        this.updatePos();
    }

    updatePos() {
        const angleX = ((this.j + 0.5) / this.maze.width) * 2.0 * Math.PI,
            angleY = ((this.i + 0.5) / this.maze.height) * 2.0 * Math.PI;

        this.pos = Utils.CalcOrbitPos(angleX, angleY, Global.entityOrbitDist);
        this.calcMatrix();
    }

    calcMatrix() {
        m4.translation(this.pos, this.mat);
        m4.inverse(this.mat, this.mat);
    }

    tryMoveUp() {
        if (this.maze.canMove(this.i, this.j, this.i + 1, this.j)) {
            this.i = (this.i + 1) % this.maze.height;
            this.updatePos();
        }
    }

    tryMoveDown() {
        if (this.maze.canMove(this.i, this.j, this.i - 1, this.j)) {
            this.i = (this.i + this.maze.height - 1) % this.maze.height;
            this.updatePos();
        }
    }

    tryMoveLeft() {
        if (this.maze.canMove(this.i, this.j, this.i, this.j - 1)) {
            this.j = (this.j + this.maze.width - 1) % this.maze.width;
            this.updatePos();
        }
    }

    tryMoveRight() {
        if (this.maze.canMove(this.i, this.j, this.i, this.j + 1)) {
            this.j = (this.j + 1) % this.maze.width;
            this.updatePos();
        }
    }
}