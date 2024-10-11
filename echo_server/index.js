const {createServer} = require('node:http');
require('dotenv').config();

const port = process.env.PORT;
const server = createServer((req, res) => {
    if(req.method == 'POST'){
        let body = [];
        req.on('data', (chunk)=> {
            body.push(chunk);
        });
        req.on("end", () => {
            body = Buffer.concat(body).toString();
            console.log('Received body:', body);
            res.statusCode  =200;
            res.setHeader('Content-type', 'text/plain');
            res.end(`Echo: ${body}`);
        });

        res.on("error", (err) => {
            console.error('Error is : ', err);
            res.statusCode = 400;
            res.end('Bad Request!');
        });
        // req.pipe(res); // Connects readable req stream directly to the writable res stream, effectively echoing the data without manual event handling.
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-type', 'plain/text');
        res.end('Send a Post Request to get the Respopnse Echoed');
    }

});


server.listen(port, () => {
    console.log(`Server running successfully!!`);
})


