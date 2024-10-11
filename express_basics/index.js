const express = require('express');

const app =express();


app.use(express.static('public')); // serving a static file in express
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req,res) => {
    res.send('POST Request Worked');
});

app.put('/',(req,res) => {
    res.send('PUT Request Worked');
});

app.delete('/', (req,res) => {
    res.send('Delete Request Worked')
});


app.listen(3000, () => {
    console.log('Server is running fine');
})