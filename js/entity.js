
import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { v3, m4 } from '/twgl.js';

export class Entity {
    maze;
    i;
    j;
    pos;
    targetPos;
    mat;

    constructor(maze, i = 0, j = 0) {
        this.maze = maze;
        this.i = i;
        this.j = j;
        this.mat = m4.identity();

        this.updatePos(true);
    }

    updatePos(initial = false) {
        const angleX = ((this.j + 0.5) / this.maze.width) * 2.0 * Math.PI,
            angleY = ((this.i + 0.5) / this.maze.height) * 2.0 * Math.PI;

        this.targetPos = Utils.CalcOrbitPos(angleX, angleY, Global.entityOrbitDist);
        if (initial) {
            this.pos = Utils.CalcOrbitPos(angleX, angleY, Global.entityOrbitDist);
        }

        this.#calcMatrix();
    }

    updateSmooth(dt) {
        const smoothRatio = 10.0;
        const change = Utils.Clamp(smoothRatio * dt, 0.0, 1.0);
        const dv = v3.subtract(this.targetPos, this.pos);
        v3.mulScalar(dv, change, dv);

        v3.add(this.pos, dv, this.pos);
    }

    #calcMatrix() {
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