import { v3 } from '/twgl.js';

export class Camera {
    pos = v3.create(0.0, 0.0, 0.0);
    angleX = 0.0;
    angleY = 0.0;
    up = v3.create(0.0, 1.0, 0.0);
    target = v3.create(0.0, 0.0, 0.0);
}