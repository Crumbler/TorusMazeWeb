import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { ShaderProgram } from '/shaderprogram.js';
import { ShaderInfo } from '/shaderinfo.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';

const canvas = Global.canvas;
const gl = Global.gl;


async function main() {
    if (!gl) {
        console.error('WebGL 2 not supported');
        return;
    }

    Utils.resizeCanvasToDisplaySize(canvas);

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0);

    await Global.Init();

    const program = new ShaderProgram(new ShaderInfo('Vertex shader', Global.shaders.vShader, gl.VERTEX_SHADER),
      new ShaderInfo('Fragment shader', Global.shaders.fShader, gl.FRAGMENT_SHADER));

    const positions = [
      -1, 1,
      1, 1,
      -1, -1,
      1, -1
    ];

    const model = Loader.LoadTorusRect(positions);

    Renderer.Prepare();

    program.start();

    Renderer.RenderTorusRect(model);
}

main();