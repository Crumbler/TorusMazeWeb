import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';
import { TorusShader } from '/torusshader.js';
import { Maze } from '/maze.js';
import { Entity } from '/entity.js';
import { Camera } from '/camera.js';

const canvas = Global.canvas;
const gl = Global.gl;
const camera = new Camera();
const maze = new Maze(Global.gridWidth, Global.gridHeight);
const playerEntity = new Entity(maze),
  endEntity = new Entity(maze, Global.gridHeight / 2, Global.gridWidth / 2);

let program, model, mazeTexture,
  mouseLeftDown = false, mouseRightDown = false;


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
  canvas.addEventListener('wheel', onMouseScroll);

  await Global.Init();

  init();

  await fetchMaze();

  requestAnimationFrame(update);
}


function calcMatrices() {
  Utils.CalcProjectionMatrix();
  Utils.CalcViewMatrix(camera);
}


function onMouseScroll(e) {
  e.preventDefault();

  camera.changeOrbitDistance(e.deltaY * 0.0002);
}


function onMouseDown(e) {
  if (e.button === 0) {
    mouseLeftDown = true;
  }
  else if (e.button === 2) {
    mouseRightDown = true;
  }
}


function onMouseUp(e) {
  if (e.button === 0) {
    mouseLeftDown = false;
  }
  else if (e.button === 2) {
    mouseRightDown = false;
  }
}


function onMouseLeave(e) {
  mouseLeftDown = false;
  mouseRightDown = false;
}


function onMouseMove(e) {
  if (mouseLeftDown) {
    camera.angleX += -e.movementX * 0.01;

    if (Math.abs(camera.angleX) > Math.PI * 2.0) {
      camera.angleX -= Math.sign(camera.angleX) * Math.PI * 2.0;
    }

    camera.angleY += e.movementY * 0.01;

    if (Math.abs(camera.angleY) > Math.PI * 2.0) {
      camera.angleY -= Math.sign(camera.angleY) * Math.PI * 2.0;
    }
  }

  if (mouseRightDown) {
    if (Utils.TryCastAndMove(e.offsetX, e.offsetY, playerEntity, camera, maze)) {
      checkVictory();
    }
  }
}


function checkVictory() {
  if (playerEntity.i === endEntity.i &&
    playerEntity.j === endEntity.j) {
    fetchMaze();
  }
}


function onKey(e) {
  if (e.code === 'KeyR') {
    fetchMaze();
  }
  else if (e.code == 'KeyW') {
    playerEntity.tryMoveUp();
    checkVictory();
  }
  else if (e.code == 'KeyD') {
    playerEntity.tryMoveRight();
    checkVictory();
  }
  else if (e.code == 'KeyS') {
    playerEntity.tryMoveDown();
    checkVictory();
  }
  else if (e.code == 'KeyA') {
    playerEntity.tryMoveLeft();
    checkVictory();
  }
}


async function fetchMaze() {
  const res = await fetch('/maze/10-60');

  const buffer = await res.arrayBuffer();

  maze.grid = new Uint8Array(buffer);

  maze.convertGrid();

  Loader.UpdateMazeTexture(mazeTexture, maze);

  camera.reset();

  playerEntity.i = 0;
  playerEntity.j = 0;
}


function init() {
  gl.clearColor(0, 0, 0, 1);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

  camera.pos[1] = 0.5;
  camera.pos[2] = 1.5;

  calcMatrices();

  mazeTexture = Loader.LoadMazeTexture(maze);

  program = new TorusShader(Global.displayWidth, Global.displayHeight,
    Global.projMatInv, Global.viewMatInv, 0, playerEntity, endEntity);

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

  camera.updateSmooth(deltaTime);
  playerEntity.updateSmooth(deltaTime);

  camera.target = Utils.CalcTargetPos(camera.angleX);
  camera.pos = Utils.CalcOrbitPos(camera.angleX, camera.angleY, camera.orbitDistance);
  camera.up = Utils.CalcOrbitUp(camera.angleX, camera.angleY);
  Utils.CalcViewMatrix(camera);

  playerEntity.updatePos();
  program.setInvPlayerMatrix(playerEntity.mat);

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