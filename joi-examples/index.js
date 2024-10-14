const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app =express();
const port = 3000;

const schemas = require('./schemas');
const middleware = require('./middleware');

app.use(cors());
app.use(express());
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.send('Hello World');
});

app.post('/blog', middleware(schemas.blogPOST, 'body'), (req, res) => {
    console.log('/update');
    res.json(req.body);
});

app.get('/products', middleware(schemas.blogLIST, 'query'), (req,res) => {
    res.json(req.query);
});

app.get('/products/:id', middleware(schemas.blogDETAILS, 'params'), (req,res) => {
    res.json(req.params);
});


app.listen(3000, () => {
    console.log('Running at port 3000');
});

