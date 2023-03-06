import express from 'express';
//import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors'
import connectDB from './db/connect.js';
const app=express();
//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js"
//Routes
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'
//app.use(cors())
if(process.env.NODE_ENV!=='production'){
    app.use(morgan('dev'))
}
app.use(express.json())
app.get("/api/v1",(req,res)=>{
    res.json({msg:"you are the best amu"})
})

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',jobsRouter);
app.use(notFoundMiddleware)
// place always as last route
app.use(errorHandlerMiddleware)
const port =process.env.PORT || 3000

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