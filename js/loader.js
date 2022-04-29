
import { RawModel } from '/rawmodel.js';
import { Global } from '/global.js';

const gl = Global.gl;

export class Loader {
    static CreateVAO() {
        const vaoID = gl.createVertexArray();
        gl.bindVertexArray(vaoID);
        return vaoID;
    }

    static LoadTorusRect(positions) {
        const vaoID = this.CreateVAO();
        this.#StoreTorusRectPoints(0, positions);
        gl.enableVertexAttribArray(0);

        return new RawModel(vaoID, positions.length / 2);
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