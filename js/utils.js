
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
    m4.perspective(Math.PI / 2, Global.displayWidth / Global.displayHeight, 1000, 0.1, Global.projMat.data);

    m4.inverse(Global.projMat.data, Global.projMatInv.data);
  }

  static CalcViewMatrix() {
    m4.lookAt(Global.camera.pos, v3.create(0.0, 0.0, 0.0), v3.create(0.0, 1.0, 0.0), Global.viewMatInv.data);

    m4.inverse(Global.viewMatInv.data, Global.viewMat.data);
  }
}