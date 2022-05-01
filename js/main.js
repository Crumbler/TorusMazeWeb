import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';
import { TorusShader } from '/torusshader.js';

const canvas = Global.canvas;
const gl = Global.gl;
const camera = Global.camera;

let program, model, mouseDown = false;


async function main() {
  if (!gl) {
    console.error('WebGL 2 not supported');
    return;
  }

  canvas.addEventListener('keydown', onKey);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);

  await Global.Init();

  init();

  requestAnimationFrame(update);
}


function calcMatrices() {
  Utils.CalcProjectionMatrix();
  Utils.CalcViewMatrix();
}


function onMouseDown(e) {
  mouseDown = true;
}


function onMouseUp(e) {
  mouseDown = false;
}


function onMouseMove(e) {
  if (mouseDown) {
    camera.angleX += -e.movementX * 0.01;

    if (Math.abs(camera.angleX) > Math.PI * 2.0) {
      camera.angleX -= Math.sign(camera.angleX) * Math.PI * 2.0;
    }

    camera.angleY += e.movementY * 0.01;

    if (Math.abs(camera.angleY) > Math.PI * 2.0) {
      camera.angleY -= Math.sign(camera.angleY) * Math.PI * 2.0;
    }
  }
}


function onKey(e) {
  //console.log(e.code);
}


function init() {
  gl.clearColor(0, 0, 0, 1);

  Global.camera.pos[1] = 0.5;
  Global.camera.pos[2] = 1.5;

  calcMatrices();

  program = new TorusShader(Global.displayWidth, Global.displayHeight,
    Global.projMatInv, Global.viewMatInv);

  const positions = [
    -1, 1,
    1, 1,
    -1, -1,
    1, -1
  ];

  model = Loader.LoadTorusRect(positions);
}


function resize() {
  gl.viewport(0, 0, canvas.width, canvas.height);

  calcMatrices();

  program.start();
  program.setResolution(canvas.width, canvas.height);
  program.setInvProjMatrix(Global.projMatInv);
}


let oldTime = 0;

function update(currTime) {
  if (Utils.ResizeCanvas()) {
    resize();
  }

  currTime *= 0.001;
  const deltaTime = currTime - oldTime;
  oldTime = currTime;

  Utils.CalcOrbitPosAndTarget(camera);
  Utils.CalcOrbitUp(camera);
  Utils.CalcViewMatrix();

  display(currTime);

  requestAnimationFrame(update);
}


function display(currTime) {
  Renderer.Prepare();

  program.start();
  program.setTime(currTime);
  program.setInvViewMatrix(Global.viewMatInv);
  Renderer.RenderTorusRect(model);
}


main();