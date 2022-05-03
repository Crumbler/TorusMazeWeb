const express = require('express');
const app = express();
const fs = require('fs');
const { generateMaze } = require('./maze.js');
const port = 80;
const gridWidth = 60, gridHeight = 10;

let shaders = {};

function prepareShaders() {
    const readDirMain = fs.readdirSync('shaders');

    readDirMain.forEach(dir => {
        const fileContent = fs.readFileSync(`shaders/${dir}`, 'utf-8');
        const dotInd = dir.indexOf('.');
        const shaderName = dir.slice(0, dotInd);
        shaders[shaderName] = fileContent;
    });
}


prepareShaders();


app.use('/', express.static('html'));
app.use('/', express.static('css'));
app.use('/', express.static('js'));


app.get('/shaders', (req, res) => {
    res.send(shaders);
});


app.get('/twgl.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/twgl.js/dist/4.x/twgl-full.module.js');
});


app.get('/maze/:height-:width', (req, res) => {
    const width = Number(req.params.width),
        height = Number(req.params.height);

    const mazeArr = generateMaze(width, height);

    res.send(Buffer.from(mazeArr));
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});