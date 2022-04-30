

import { array, zeros } from '/vectorious.js';

export class Global {
    static canvas = document.querySelector("#c");
    static gl = Global.canvas.getContext("webgl2");

    static displayWidth;
    static displayHeight;

    static shaders;

    static projMat = zeros(4, 4);
    static projMatInv;

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
        const ar = this.displayWidth / this.displayHeight;
        const fov = Math.PI / 2; // 90 degrees
        const yScale = 1 / Math.tan(fov / 2);
        const xScale = yScale / ar;
        const far = 1000, near = 0.1;
        const frLength = far - near;
        const cmp1 = (-near - far) / frLength;
        const cmp2 = -2 * far *near /frLength;

        this.projMat.set(0, 0, xScale);
        this.projMat.set(1, 1, yScale);
        this.projMat.set(2, 2, cmp1);
        this.projMat.set(2, 3, cmp2);
        this.projMat.set(3, 2, -1);

        this.projMatInv = this.projMat.inv();
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

