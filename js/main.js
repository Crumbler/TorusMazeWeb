import { Global } from '/global.js';
import { Utils } from '/utils.js';
import { ShaderProgram } from '/shaderprogram.js';
import { ShaderInfo } from '/shaderinfo.js';
import { Loader } from '/loader.js';
import { Renderer } from '/renderer.js';

const canvas = Global.canvas;
const gl = Global.gl;


function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

    return undefined;
  }
  
  
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
}


async function main() {
    if (!gl) {
        console.error('WebGL 2 not supported');
        return;
    }

    Utils.resizeCanvasToDisplaySize(canvas);

    gl.viewport(0, 0, canvas.width, canvas.height);

    await Global.Init();

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, Global.shaders.vShader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, Global.shaders.fShader);

    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    const positions = [
      -1, 1,
      1, 1,
      1, -1,
    ];

    const model = Loader.LoadTorusRect(positions);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    Renderer.RenderTorusRect(model);
}

main();