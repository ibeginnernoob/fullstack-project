import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import apiRouter from './routes/index.js';

import { MONGODB_URI } from './config.js';

const app=express();

mongoose.connect(MONGODB_URI);

app.use(cors());

app.use(bodyParser.json());

app.use('/api/v1',apiRouter);

app.listen(3000,()=>{
    console.log('listening on port 3000!');
});