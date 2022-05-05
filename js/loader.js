
import { RawModel } from '/rawmodel.js';
import { Global } from '/global.js';

const gl = Global.gl;

export class Loader {
    static CreateVAO() {
        const vaoID = gl.createVertexArray();
        gl.bindVertexArray(vaoID);
        return vaoID;
    }

    static LoadTorusRect(s) {
        const vaoID = this.CreateVAO();

        const positions = [
            -1, 1,
            1, 1,
            -1, -1,
            1, -1
        ];
        this.#StoreTorusRectPoints(0, positions);
        gl.enableVertexAttribArray(0);

        return new RawModel(vaoID, positions.length / 2);
    }

    static LoadMazeTexture(maze) {
        const textureID = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureID);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, maze.width, maze.height * 2, 0, gl.RED, gl.UNSIGNED_BYTE, null);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        return textureID;
    }

    static UpdateMazeTexture(textureID, maze) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureID);

        // offset 0, 0
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0.0, 0.0, maze.width, maze.height * 2, gl.RED, gl.UNSIGNED_BYTE, maze.data);
    }

    static #StoreTorusRectPoints(attributeNumber, data) {
        const vboID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboID);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attributeNumber, 2, gl.FLOAT, false, 0, 0);
    }

    static UnbindVAO() {
        gl.bindVertexArray(0);
    }
}