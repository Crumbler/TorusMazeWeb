
import { Global } from '/global.js';

const gl = Global.gl;

export class Renderer {
    static Prepare() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    static RenderTorusRect(model) {
        gl.bindVertexArray(model.vaoID);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, model.vertexCount);
        //gl.bindVertexArray(0);
    }

    static UpdateProjectionMatrix(shader, mat) {
        shader.start();
        shader.loadProjectionMatrix(mat);
        shader.stop();
    }
}