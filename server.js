const express = require('express');
const app = express();
const fs = require('fs');
const port = 80;


let shaders = { };

function prepareShaders() {
    const readDirMain = fs.readdirSync('shaders');

    readDirMain.forEach(dir => {
        const fileContent = fs.readFileSync(`shaders/${dir}`, 'utf-8');
        const dotInd = dir.indexOf('.');
        const shadername = dir.slice(0, dotInd);
        shaders[shadername] = fileContent;
    });
}


prepareShaders();


app.use('/', express.static('html'));
app.use('/', express.static('css'));
app.use('/', express.static('js'));


app.get('/shaders', (req, res) => {
    res.send(shaders);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});