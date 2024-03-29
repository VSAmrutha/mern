import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors'
import connectDB from './db/connect.js';
const app=express();
//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from './middleware/auth.js';
//Routes
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'
app.use(cors())
if(process.env.NODE_ENV!=='production'){
    app.use(morgan('dev'))
}
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname,'./client/build')))
app.use(express.json())
//security packages
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())



app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUser,jobsRouter);
//this is to hanle react routes
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./client/build','index.html'))
})
app.use(notFoundMiddleware)
// place always as last route
app.use(errorHandlerMiddleware)
const port =process.env.PORT || 4000

const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URL);
        app.listen(port,()=>{
            console.log(`server running in port ${port}`)
        })
    }catch(err){
        console.log(err)
    }
}
start()

//"proxy": "http://localhost:5000"