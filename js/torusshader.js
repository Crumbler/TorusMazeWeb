
import { ShaderProgram } from '/shaderprogram.js';
import { ShaderInfo } from '/shaderinfo.js';
import { Global } from '/global.js';

const gl = Global.gl;

export class TorusShader extends ShaderProgram {
    #loc_res;
    #loc_mProjInv;
    #loc_mViewInv;
    #loc_time;
    #loc_mazeText;

    constructor(width, height, mProjInv, mViewInv, mazeText) {
        super();

        const shaderInfos = [
            new ShaderInfo('Vertex shader', Global.shaders.vTorusShader, gl.VERTEX_SHADER),
            new ShaderInfo('Fragment shader', Global.shaders.fTorusShader, gl.FRAGMENT_SHADER)
        ];

        this._init(...shaderInfos);

        this.start();
        this.setResolution(width, height);
        this.setInvProjMatrix(mProjInv);
        this.setInvViewMatrix(mViewInv);
        this.setMazeTexture(mazeText);
    }

    _bindAttributes = function () {
        this._bindAttribute(0, 'position');
    }

    _getAllUniformLocations = function () {
        this.#loc_res = this._getUniformLocation('resolution');
        this.#loc_mProjInv = this._getUniformLocation('mProjInv');
        this.#loc_mViewInv = this._getUniformLocation('mViewInv');
        this.#loc_time = this._getUniformLocation('time');
        this.#loc_mazeText = this._getUniformLocation('mazeText');
    }

    setTime(time) {
        ShaderProgram._LoadFloat(this.#loc_time, time);
    }

    setResolution(width, height) {
        ShaderProgram._LoadVector2(this.#loc_res, width, height);
    }

    setInvProjMatrix(mProjInv) {
        ShaderProgram._LoadMatrix(this.#loc_mProjInv, mProjInv);
    }

    setInvViewMatrix(mViewInv) {
        ShaderProgram._LoadMatrix(this.#loc_mViewInv, mViewInv);
    }

    setMazeTexture(texture) {
        ShaderProgram._LoadInt(this.#loc_mazeText, texture);
    }
}