import { v3 } from '/twgl.js';
import { Global } from '/global.js';
import { Utils } from '/utils.js';

export class Camera {
    pos = v3.create(0.0, 0.0, 0.0);
    angleX = 0.0;
    angleY = 0.0;
    up = v3.create(0.0, 1.0, 0.0);
    target = v3.create(0.0, 0.0, 0.0);
    targetOrbitDistance = Global.orbitDist;
    orbitDistance = Global.orbitDist;

    reset() {
        this.angleX = (0.5 / Global.gridWidth) * Math.PI * 2.0;
        this.angleY = (0.5 / Global.gridHeight) * Math.PI * 2.0;
    }

    updateSmooth(dt) {
        const smoothRatio = 10.0;
        const change = Utils.Clamp(smoothRatio * dt, 0.0, 1.0);
        this.orbitDistance += (this.targetOrbitDistance - this.orbitDistance) * change;
    }

    changeOrbitDistance(dd) {
        this.targetOrbitDistance = Utils.Clamp(this.targetOrbitDistance + dd, 
            Global.orbitDist - Global.orbitDelta, Global.orbitDist + Global.orbitDelta);
    }
}