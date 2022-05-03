import { v3 } from '/twgl.js';
import { Global } from '/global.js';

export class Camera {
    pos = v3.create(0.0, 0.0, 0.0);
    angleX = 0.0;
    angleY = 0.0;
    up = v3.create(0.0, 1.0, 0.0);
    target = v3.create(0.0, 0.0, 0.0);

    reset() {
        this.angleX = (0.5 / Global.gridWidth) * Math.PI * 2.0;
        this.angleY = (0.5 / Global.gridHeight) * Math.PI * 2.0;
    }
}