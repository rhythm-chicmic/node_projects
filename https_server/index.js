const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

const certPath = path.join(__dirname,'server.cert');
const keyPath = path.join(__dirname, 'server.key');

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};
const server = https.createServer(options, (req,res) => {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end('Https Connection Established Successfully!');
})

server.listen(8443, () => {
    console.log('Sever running Fine!');
})