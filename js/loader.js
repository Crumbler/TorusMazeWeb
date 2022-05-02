
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

    static LoadMazeTexture() {
        const textureID = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureID);

        const data = new Uint8Array([0, 255, 0]);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 3, 1, 0, gl.RED, gl.UNSIGNED_BYTE, data);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        return textureID;
    }

    static UpdateMazeTexture(textureID) {
        const data = new Uint8Array([
            0, 127, 255
        ]);

        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0.0, 0.0, 3, 1, gl.RED, gl.UNSIGNED_BYTE, data);
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