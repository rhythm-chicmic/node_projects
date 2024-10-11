const { createServer } = require('node:http');
const fs =  require('fs');
const path =  require('path');
require('dotenv').config();

const hostname = '127.0.0.1';
const port = process.env.PORT;
const folderName = "/Users/cocos/Documents/node_projects/basics_of_node";

const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is your name?'
    }
]
console.log(process.argv);

// Accepting Inputs from Commandline
const readline  = require('node:readline');
const { type } = require('node:os');
const { strict } = require('node:assert');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What is your name?', (answer) => {
    console.log('The name is', answer);
    rl.close();
})

// Checking if the Directory Exists or Not
if(fs.existsSync(folderName)){
    console.log('Yes it existes');
    // Read The Contents of a Directory
    console.log(fs.readdirSync(folderName));
    const data = fs.readdirSync(folderName).map(fileName => {
        return path.join(folderName, fileName);
    });
    console.log(data);
}




 function readFileFun(){
    fs.readFile('textdata.txt','utf-8', (error, data) => {
        if(error) throw error;
        console.log(data);
    });

    fs.readFile(path.resolve(__dirname,'./textdata.txt'),'utf-8', (error, data) => {
        if(error) throw error;
        console.log(data);
    });

    const data = fs.readFileSync('textdata.txt','utf-8','r');
    console.log(data);
 }

 function createNewFileFun() {
    fs.open('newFile.txt', 'w', (error) => {
        if(error) throw error;
        console.log('file created Successfully');
    })
 }

 function addDatainFileFun() {
    fs.appendFile('newFile.txt', 'This is the content which I want to add', (error) => {
        if(error) throw error;
        console.log('File Appended Data');
    })
 }

 function renameFileFun() {
    fs.rename('newFile.txt', 'newfile.txt', (error) => {
        if(error) throw error;
        console.log('new File Name changed');
    })
 }

 function unlinkFileFun(){
    fs.unlink('newfile.txt',(error) => {
        if(error) throw error;
        console.log('File Deleted SuccessFully');
    })
 }

 function writeDataInFileFun() {
    fs.writeFile('newFile.txt', 'Replace with New Data', (error) => {
        if(error) throw error;
        console.log('File ReWrite Successfully');
    })
 }


// const server  = createServer((req, res)=> {
//     res.statusCode = 200;
//     res.setHeader('Content-type', 'text/plain');
//     res.end('Hello World');
// });

// server.listen(port, () => {
//     console.log('Server is listening at port:', port);
// });


const server = createServer((req, res) => {
    const {method, headers, url} =req;

    console.log(`Received ${method} request for: ${url}`);
    console.log('Headers:', headers);

    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');

    const responseBody = {
        method,
        url,
        headers
    };

    res.end(JSON.stringify(responseBody,null, 2));
});

server.listen(port, (res) => {
    console.log(`Server is running successfully!!`);
})