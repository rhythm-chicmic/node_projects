const express = require('express');
const app = express();
const joi = require('joi');
const port = 3000;

const schema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
});


const validateRequest = (schema) => {
    return (req,res,next) => {
        const result = schema.validate(req.body);
        if(result.error){
            return res.status(400).json({
                error: result.error.details[0].message
            });
        }
        if(!req.value){
            req.value = {};
        }
        req.value['body'] = result.value;
        next();
    };
};

app.post('/signup', validateRequest(schema), (req,res) => {
    res.json({
        message: 'Succefull signed up',
        data: req.value.body
    });
});


app.listen(port, () => {
    console.log('Port is listening at 3000');
});
