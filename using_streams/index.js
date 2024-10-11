require('dotenv').config();

const {createServer}  = require('node:http');

const port = process.env.PORT;
const MAX_BODY_SIZE = 1e6; // 1MB

const server = createServer((req, res) => {
    if(req.method == "POST" && req.url == '/upload'){
        let body = [];
        let bodySize =0;
        req.on("data", chunk => {
            body.push(chunk);
            bodySize += chunk.length;
            // Prevent too much data
            if (bodySize > MAX_BODY_SIZE) {
                res.statusCode = 413; // Payload Too Large
                res.end('Payload Too Large');
                req.destroy();
            }
        });

        req.on('end', () => {
         body = Buffer.concat(body).toString();
         console.log('Received Body', body);
         res.statusCode = 200;
         res.setHeader('Content-type', 'application/json');
         res.end(JSON.stringify({message: 'Uploaded Successfully', data:body}));
        });

        req.on('error',(err) => {
            console.log('Requested Error:', err);
            res.statusCode =400;
            res.end('Bad Request');
        });
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json')
        res.end('Not Found')
    }    
});

server.listen(port, () => {
    console.log('Server Running Fine');
});