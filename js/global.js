
export class Global {
    static canvas = document.querySelector("#c");
    static gl = Global.canvas.getContext("webgl2");

    static shaders;

    static async Init() {
        await this.FetchShaders();
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
}

