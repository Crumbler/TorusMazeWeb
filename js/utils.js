
import { Global } from '/global.js';
import { m4, v3 } from '/twgl.js';

const canvas = Global.canvas;

export class Utils {
  static ResizeCanvas() {
    const displayWidth = Global.displayWidth;
    const displayHeight = Global.displayHeight;

    const needResize = canvas.width !== displayWidth ||
      canvas.height !== displayHeight;

    if (needResize) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }

  static CalcProjectionMatrix() {
    m4.perspective(Math.PI / 2, Global.displayWidth / Global.displayHeight, 1000, 0.1, Global.projMat);

    m4.inverse(Global.projMat, Global.projMatInv);
  }

  static CalcViewMatrix() {
    m4.lookAt(Global.camera.pos, Global.camera.target, Global.camera.up, Global.viewMatInv);

    m4.inverse(Global.viewMatInv, Global.viewMat);
  }

  static CalcTargetPos(angleX) {
    const s1 = Math.sin(angleX),
      c1 = Math.cos(angleX);

    return v3.mulScalar(v3.create(s1, 0.0, c1), Global.rInner);
  }

  static CalcOrbitPos(angleX, angleY) {
    const s1 = Math.sin(angleX),
      c1 = Math.cos(angleX),
      s2 = Math.sin(angleY),
      c2 = Math.cos(angleY);

    const base = v3.create(s1, 0.0, c1);
    v3.mulScalar(base, Global.rInner, base);

    const extra = v3.create(c2 * s1, s2, c2 * c1);
    v3.mulScalar(extra, Global.rOuter + Global.orbitDist, extra);

    return v3.add(base, extra);
  }

  static CalcOrbitUp(angleX, angleY) {
    const rx = m4.rotationY(angleX);
    m4.rotateX(rx, -angleY, rx);

    return m4.transformDirection(rx, v3.create(0.0, 1.0, 0.0));
  }
}