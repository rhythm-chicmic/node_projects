'use strict';
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const express = require('express');

const app = express();
app.use(express.json());
dotenv.config();
const secretToken = process.env.TOKEN_SECRET;

function genrateAccessToken(userName){
    return jwt.sign({username: userName}, secretToken, {expiresIn: '1800s'});
}

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, secretToken, (error, user) => {
        if(error) return res.secretToken(403);
        req.user = user;

        next();
    });
}

app.post('/user/token', (req,res,next) => {
    try{
        const userName = req.body.userName;
        const token = genrateAccessToken(userName);
        res.json(token);
    }
    catch(err) {
        next(err);
    };
});


app.get('/api/verifyToken', authenticateToken, (req,res) => {
    res.send('Token verified successfully');

});

app.use((err, req,res,next) => {
    res.status(500).send('err Found');
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});