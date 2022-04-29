import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { ShaderProgram } from '/shaderprogram.js';
import { ShaderInfo } from '/shaderinfo.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';

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
    gl.clearColor(0, 0, 0, 0);

    program = new ShaderProgram(new ShaderInfo('Vertex shader', Global.shaders.vShader, gl.VERTEX_SHADER),
      new ShaderInfo('Fragment shader', Global.shaders.fShader, gl.FRAGMENT_SHADER));

    const positions = [
      -1, 1,
      1, 1,
      -1, -1,
      1, -1
    ];

    model = Loader.LoadTorusRect(positions);
}


let oldTime = 0;

function display(currTime) {
    if (Utils.ResizeCanvas()) {
      gl.viewport(0, 0, canvas.width, canvas.height);
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