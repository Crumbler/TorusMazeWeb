
import { zeros} from '/vectorious.js';
import { Camera } from '/camera.js';

export class Global {
    static canvas = document.querySelector("#c");
    static gl = Global.canvas.getContext("webgl2");

    static camera = new Camera();

    static rOuter = 0.1;
    static rInner = 1.0;
    static orbitDist = Global.rOuter + 0.3;

    static displayWidth;
    static displayHeight;

    static shaders;

    static projMat = zeros(4, 4);
    static projMatInv = zeros(4, 4);
    static viewMat = zeros(4, 4);
    static viewMatInv = zeros(4, 4);

    static async Init() {
        await this.FetchShaders();

        Global.displayWidth = Global.canvas.clientWidth;
        Global.displayHeight = Global.canvas.clientHeight;

        const resizeObserver = new ResizeObserver(Global.OnCanvasResize);
        resizeObserver.observe(Global.canvas, {box: 'device-pixel-content-box'});
    }

    static async FetchShaders() {
        const response = await fetch('/shaders');

        if (response.ok) {
            Global.shaders = await response.json();
        }
        else {
            console.error('Failed to get shaders');
        }
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

