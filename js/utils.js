
import { Global } from '/global.js';

const canvas = Global.canvas;

export class Utils {
    static ResizeCanvas() {
        const displayWidth  = Global.displayWidth;
        const displayHeight = Global.displayHeight;
       
        const needResize = canvas.width  !== displayWidth ||
                           canvas.height !== displayHeight;
       
        if (needResize) {
          canvas.width  = displayWidth;
          canvas.height = displayHeight;
        }

        return needResize;
    }
}