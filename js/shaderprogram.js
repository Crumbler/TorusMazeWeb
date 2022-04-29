
import { Global } from '/global.js';

const gl = Global.gl;

export class ShaderProgram {
    #programID;
    #bindAttributes;
    #getAllUniformLocations;

    constructor(...shaderInfos) {
        const shaderIds = new Array(shaderInfos.length);

        for (let i = 0; i < shaderIds.length; ++i) {
            shaderIds[i] = ShaderProgram.#LoadShader(shaderInfos[i]);
        }

        this.programID = gl.createProgram();

        for (const id of shaderIds) {
            gl.attachShader(this.programID, id);
        }

        this.#bindAttributes?.();

        gl.linkProgram(this.programID);
        gl.validateProgram(this.programID);
        this.#getAllUniformLocations?.();
    }

    start() {
        gl.useProgram(this.programID);
    }

    stop() {
        gl.useProgram(0);
    }

    static #LoadShader(shaderInfo) {
        const shaderID = gl.createShader(shaderInfo.type);

        console.log("Compiling shader " + shaderInfo.name);

        gl.shaderSource(shaderID, shaderInfo.source);
        gl.compileShader(shaderID);

        const success = gl.getShaderParameter(shaderID, gl.COMPILE_STATUS);
        if (success) {
            return shaderID;
        }
    
        console.error(gl.getShaderInfoLog(shaderID));
    }
}