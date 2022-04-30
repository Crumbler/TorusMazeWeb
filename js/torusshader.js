
import { ShaderProgram } from '/shaderprogram.js';
import { ShaderInfo } from '/shaderinfo.js';
import { Global } from '/global.js';

const gl = Global.gl;

export class TorusShader extends ShaderProgram {
    #loc_res;
    #loc_mProjInv;

    constructor(width, height, mProjInv) {
        super();

        const shaderInfos = [
            new ShaderInfo('Vertex shader', Global.shaders.vTorusShader, gl.VERTEX_SHADER),
            new ShaderInfo('Fragment shader', Global.shaders.fTorusShader, gl.FRAGMENT_SHADER)
        ];

        this._init(...shaderInfos);

        this.start();
        this.setResolution(width, height);
        this.setInvProjMatrix(mProjInv);
    }

    _bindAttributes = function () {
        this._bindAttribute(0, 'position');
    }

    _getAllUniformLocations = function () {
        this.#loc_res = this._getUniformLocation('resolution');
        this.#loc_mProjInv = this._getUniformLocation('mProjInv');
    }

    setResolution(width, height) {
        ShaderProgram._LoadVector2(this.#loc_res, width, height);
    }

    setInvProjMatrix(mProjInv) {
        ShaderProgram._LoadMatrix(this.#loc_mProjInv, mProjInv);
    }
}