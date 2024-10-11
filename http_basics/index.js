const { createServer } = require('node:http');
const { URL } = require('node:url');
const server = createServer((req, res) => {
    const { headers, url } = req;

    const requestURL = new URL(url, `http://${headers.host}`);

    console.log(requestURL);

    const pathSegments = requestURL.pathname.split('/').filter(Boolean);

    const queryParams = Object.fromEntries(requestURL.searchParams.entries());


    console.log('Path Segments:', pathSegments);
    console.log('Query Params:', queryParams);



    console.log(url);
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.end(`Path : ${pathSegments.join('/')} \n Query : ${JSON.stringify(queryParams)} `);
});

server.listen(3000, ()=> {
    console.log('Server Running Successfully');
});