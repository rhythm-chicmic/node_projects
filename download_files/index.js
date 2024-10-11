const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

const FILE_DIRECTORIES = path.join(__dirname, 'public');
app.use('/public', express.static(FILE_DIRECTORIES));

console.log(FILE_DIRECTORIES);


app.get('/data', (req,res,next) => {
    res.send('<ul>' +
    '<li>Download <a href="/public/notes/groceries.txt">notes/groceries.txt</a>.</li>' +
    '<li>Download <a href="/public/amazing.txt">amazing.txt</a>.</li>' +
    '<li>Download <a href="/public/missing.txt">missing.txt</a>.</li>' +
    '<li>Download <a href="/public/random.txt">random.txt</a>.</li>' +
    '<li>Download <a href="/public/test.odt">random.txt</a>.</li>' +
    '</ul>')
});


app.listen(3000, () => {
    console.log('Express started on port 3000');
})