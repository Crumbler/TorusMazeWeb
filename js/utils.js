
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

  static CalcOrbitPos(angleX, angleY, orbitDist) {
    const s1 = Math.sin(angleX),
      c1 = Math.cos(angleX),
      s2 = Math.sin(angleY),
      c2 = Math.cos(angleY);

    const base = v3.create(s1, 0.0, c1);
    v3.mulScalar(base, Global.rInner, base);

    const extra = v3.create(c2 * s1, s2, c2 * c1);
    v3.mulScalar(extra, Global.rOuter + orbitDist, extra);

    return v3.add(base, extra);
  }

  static CalcOrbitUp(angleX, angleY) {
    const rx = m4.rotationY(angleX);
    m4.rotateX(rx, -angleY, rx);

    return m4.transformDirection(rx, v3.create(0.0, 1.0, 0.0));
  }

  static TryCastAndMove(x, y, playerEntity, maze) {
    const cast = Utils.#CastToTorus(x, y);
    let moved = false;

    if (cast.hit) {
      const coords = Utils.#GetCoords(cast.pos);
      if (maze.canMove(playerEntity.i, playerEntity.j, coords.y, coords.x)) {
        moved = true;
        playerEntity.i = coords.y;
        playerEntity.j = coords.x;
      }
    }

    if (moved) {
      playerEntity.updatePos();
    }

    return moved;
  }

  static #GetCoords(pos) {
    let innerAngle = Utils.#GetAtan(pos[0], pos[2]);
    innerAngle *= Global.gridWidth;
    innerAngle = Math.floor(innerAngle);

    const newAxis = v3.create(pos[0], 0.0, pos[2]);
    v3.normalize(newAxis, newAxis);
    const orbitPos = v3.mulScalar(newAxis, Global.rInner);
    const dv = v3.subtract(pos, orbitPos);
    let outerAngle = Utils.#GetAtan(pos[1], v3.dot(dv, newAxis));
    outerAngle *= Global.gridHeight;
    outerAngle = Math.floor(outerAngle);

    return {
      x: innerAngle,
      y: outerAngle
    };
  }

  static #GetAtan(y, x) {
    const res = (Math.atan2(y, x) + Math.PI) * 0.5 / Math.PI;
    return res + 0.5 - Math.floor(res + 0.5);
  }

  static #CastToTorus(x, y) {
    const rayDir = Utils.#RayFromCam(x, y),
      rayOrigin = Global.camera.pos;

    let t = 0.0, h, pos = v3.create(0.0, 0.0, 0.0);

    for (let i = 0; i < 64; ++i) {
      v3.copy(rayDir, pos);
      v3.mulScalar(pos, t, pos);
      v3.add(rayOrigin, pos, pos);

      h = Utils.#DistToTorus(pos);

      if (h < 0.001 || h > 5.0) {
        break;
      }

      t += h;
    }

    return {
      pos,
      hit: Math.abs(h) < 0.001
    };
  }

  static #DistToTorus(p) {
    const cast = v3.normalize(v3.create(p[0], 0.0, p[2]));

    if (v3.length(cast) < 0.0001) {
      cast[0] = 1.0;
    }

    v3.mulScalar(cast, Global.rInner, cast);
    const res = v3.distance(p, cast) - Global.rOuter;

    return res;
  }

  static #RayFromCam(x, y) {
    x = (x * 2.0 - Global.displayWidth) / Global.displayWidth;
    y = -(y * 2.0 - Global.displayHeight) / Global.displayHeight;

    const rayClip = v3.create(x, y, -1.0);
    m4.transformDirection(Global.projMatInv, rayClip, rayClip);
    rayClip[2] = -1.0;
    m4.transformDirection(Global.viewMatInv, rayClip, rayClip);
    v3.normalize(rayClip, rayClip);

    return rayClip;
  }
}