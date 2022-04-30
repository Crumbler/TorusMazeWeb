
import { array, zeros, NDArray } from '/vectorious.js';
import { m4 } from '/twgl.js';

export class Global {
    static canvas = document.querySelector("#c");
    static gl = Global.canvas.getContext("webgl2");

    static displayWidth;
    static displayHeight;

    static shaders;

    static projMat = zeros(4, 4);
    static projMatInv = zeros(4, 4);

    static async Init() {
        await this.FetchShaders();

        Global.displayWidth = Global.canvas.clientWidth;
        Global.displayHeight = Global.canvas.clientHeight;

        const resizeObserver = new ResizeObserver(Global.OnCanvasResize);
        resizeObserver.observe(Global.canvas, {box: 'device-pixel-content-box'});

        this.CalcMatrices();
    }

    static async FetchShaders() {
        const response = await fetch('/shaders');

        if (response.ok) {
            this.shaders = await response.json();
        }
        else {
            console.error('Failed to get shaders');
        }
    }

    static CalcMatrices() {
        Global.#CalcProjectionMatrix();
    }

    static #CalcProjectionMatrix() {
        m4.perspective(Math.PI / 2, Global.displayWidth / Global.displayHeight, 1000, 0.1, Global.projMat.data);
        m4.transpose(Global.projMat.data, Global.projMat.data);

        m4.inverse(Global.projMat.data, Global.projMatInv.data);
    }

    static OnCanvasResize(entries) {
        let width;
        let height;
        let dpr = window.devicePixelRatio;

        const entry = entries[0];

        if (entry.devicePixelContentBoxSize) {
            width = entry.devicePixelContentBoxSize[0].inlineSize;
            height = entry.devicePixelContentBoxSize[0].blockSize;
            dpr = 1;
        }

        Global.displayWidth = Math.round(width * dpr);
        Global.displayHeight = Math.round(height * dpr);
    }
}

