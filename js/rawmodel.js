
import { Global } from '/global.js';

const gl = Global.gl;

export class RawModel {
    #vaoID;
    #vertexCount;

    get vaoID() {
        return this.#vaoID;
    }

    get vertexCount() {
        return this.#vertexCount;
    }

    constructor(vaoID, vertexCount) {
        this.#vaoID = vaoID;
        this.#vertexCount = vertexCount;
    }
}