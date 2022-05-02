const express = require('express');
const app = express();
const fs = require('fs');
const port = 80;


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


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});