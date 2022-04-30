import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';
import { TorusShader } from '/torusshader.js';
import { array } from '/vectorious.js';

const canvas = Global.canvas;
const gl = Global.gl;


let program, model;


async function main() {
  if (!gl) {
    console.error('WebGL 2 not supported');
    return;
  }

  await Global.Init();

  await init();

  requestAnimationFrame(display);
}


async function init() {
  gl.clearColor(0, 0, 0, 1);

  program = new TorusShader(Global.displayWidth, Global.displayHeight);

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

  program.start();
  program.setResolution(canvas.width, canvas.height);

  
}


let oldTime = 0;

function display(currTime) {
  if (Utils.ResizeCanvas()) {
    resize();
  }

  currTime *= 0.001;

  const deltaTime = currTime - oldTime;

  oldTime = currTime;

  Renderer.Prepare();

  program.start();

  Renderer.RenderTorusRect(model);

  requestAnimationFrame(display);
}


main();