import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';
import { TorusShader } from '/torusshader.js';
import { Maze } from '/maze.js';

const canvas = Global.canvas;
const gl = Global.gl;
const camera = Global.camera;
const maze = new Maze(Global.gridWidth, Global.gridHeight);

let program, model, mazeTexture, mouseDown = false;


async function main() {
  if (!gl) {
    console.error('WebGL 2 not supported');
    return;
  }

  canvas.addEventListener('keydown', onKey);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);

  await Global.Init();

  init();

  requestAnimationFrame(update);
}


function calcMatrices() {
  Utils.CalcProjectionMatrix();
  Utils.CalcViewMatrix();
}


function onMouseDown(e) {
  if (e.button === 0) {
    mouseDown = true;
  }
}


function onMouseUp(e) {
  if (e.button === 0) {
    mouseDown = false;
  }
}


function onMouseLeave(e) {
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
  if (e.code === 'KeyR') {
    fetchMaze();
  }
}


async function fetchMaze() {
  const res = await fetch('/maze');

  const buffer = await res.arrayBuffer();

  maze.grid = new Uint8Array(buffer);

  maze.convertGrid();

  Loader.UpdateMazeTexture(mazeTexture, maze);

  camera.reset();
}


function init() {
  gl.clearColor(0, 0, 0, 1);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

  Global.camera.pos[1] = 0.5;
  Global.camera.pos[2] = 1.5;

  calcMatrices();

  mazeTexture = Loader.LoadMazeTexture(maze);

  program = new TorusShader(Global.displayWidth, Global.displayHeight,
    Global.projMatInv, Global.viewMatInv, 0);

  model = Loader.LoadTorusRect();
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