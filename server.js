const express = require('express');
const app = express();
const port = 80;

app.use('/', express.static('html'));
app.use('/', express.static('css'));
app.use('/', express.static('js'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});