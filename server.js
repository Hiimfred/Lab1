import express from 'express';
import recipes from 'x'
import connection from './connection.js'
import dotenv from 'dotenv'
import path  from 'path'

dotenv.config();

//setup
const port = process.env.PORT || 5000;
const app = express();

//middlewear
app.use(express.static('static'));
app.use(express.json());



app.listen(port, () => {
    console.log(`Listening @ Localhost:${ port }`)
});
