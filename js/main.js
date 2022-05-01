import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';
import { TorusShader } from '/torusshader.js';

const canvas = Global.canvas;
const gl = Global.gl;


let program, model;


async function main() {
  if (!gl) {
    console.error('WebGL 2 not supported');
    return;
  }

  await Global.Init();

  calcMatrices();

  init();

  requestAnimationFrame(update);
}

function calcMatrices() {
  Utils.CalcProjectionMatrix();
  Utils.CalcViewMatrix();
}

function init() {
  gl.clearColor(0, 0, 0, 1);

  Global.camera.pos[1] = 1.0;
  Global.camera.pos[2] = 1.0;

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