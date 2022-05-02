
import { Global } from '/global.js';

const gl = Global.gl;

export class ShaderProgram {
    #programID;
    _bindAttributes;
    _getAllUniformLocations;

    _init(...shaderInfos) {
        const shaderIds = new Array(shaderInfos.length);

        for (let i = 0; i < shaderIds.length; ++i) {
            shaderIds[i] = ShaderProgram.#LoadShader(shaderInfos[i]);
        }

        this.#programID = gl.createProgram();

        for (let id of shaderIds) {
            gl.attachShader(this.#programID, id);
        }

        this._bindAttributes?.();

        gl.linkProgram(this.#programID);

        const success = gl.getProgramParameter(this.#programID, gl.LINK_STATUS);
        if (!success) {
            throw ("Program failed to link: " + gl.getProgramInfoLog(this.#programID));
        }

        gl.validateProgram(this.#programID);
        this._getAllUniformLocations?.();
    }

    start() {
        gl.useProgram(this.#programID);
    }

    stop() {
        gl.useProgram(0);
    }

    _bindAttribute(attribute, variableName) {
        gl.bindAttribLocation(this.#programID, attribute, variableName);
    }

    _getUniformLocation(uniformName) {
        return gl.getUniformLocation(this.#programID, uniformName);
    }

    static _LoadFloat(location, x) {
        gl.uniform1f(location, x);
    }

    static _LoadInt(location, x) {
        gl.uniform1i(location, x);
    }

    static _LoadVector2(location, x, y) {
        gl.uniform2f(location, x, y);
    }

    static _LoadMatrix(location, mat) {
        gl.uniformMatrix4fv(location, false, mat);
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