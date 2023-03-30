import dotenv from 'dotenv';
dotenv.config();
import Job from './models/Jobs.js'
import {readFile} from 'fs/promises';
import connectDB from './db/connect.js'


const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        await Job.deleteMany()
        const jsonProducts=JSON.parse(await readFile(new URL('./MOCK_DATA.json',import.meta.url)))
        await Job.create(jsonProducts);
        console.log("Success!!");
        process.exit(0)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
start();
