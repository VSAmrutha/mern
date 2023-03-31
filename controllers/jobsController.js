import {StatusCodes} from 'http-status-codes'
import Job from "../models/Jobs.js"
import {BadRequestError,NotFoundError, UnauthenticatedError} from "../errors/index.js"
import {checkPermissions} from '../utils/index.js'
import mongoose from 'mongoose';
import moment from 'moment'
const createJob=async(req,res)=>{
    const {position,company}=req.body;
    if(!position || !company){
        throw new BadRequestError('Please provide all values')
    }
    req.body.createdBy=req.user.userId;
    const job=await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job})
}
const getAllJobs=async(req,res)=>{
    const {status,jobType,sort,search}=req.query;
    const queryObject={
        createdBy:req.user.userId
    }
    if(status && status !=='all'){
        queryObject.status=status
    }
    if(jobType && jobType !=='all'){
        queryObject.jobType=jobType
    }
    if(search){
        //this is from mongo db syntax, $regex:search for not exact text search,$options:'i' for case-insensitive search
        queryObject.position={$regex:search,$options:'i'}
    }
    //NO AWAIT, you will get the query here and next step will give to result after sorted
    let result= Job.find(queryObject)
    if(sort==='latest'){
        result=result.sort('-createdAt')
    }
    if(sort==='oldest'){
        result=result.sort('createdAt')
    }
    if(sort==='a-z'){
        result=result.sort('position')
    }
    if(sort==='z-a'){
        result=result.sort('-position')
    }
    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 10
    const skip=(page-1)*10
    result=result.skip(skip).limit(limit)
    const jobs=await result;
    const totalJobs=await Job.countDocuments(queryObject)
    const numOfPages=Math.ceil(totalJobs/limit)
    res.status(StatusCodes.OK).json({totalJobs,numOfPages,jobs})
}
const updateJob=async(req,res)=>{
    const {id:jobId}=req.params;
    const {company,position}=req.body;
    if(!company || !position){
        throw new BadRequestError('Please provide all values')
    }
    const job=await Job.findOne({_id:jobId});
    if(!job){
        throw new NotFoundError(`No Job with id ${jobId}`)
    }
    
    checkPermissions(req.user,job.createdBy)
    const updateJob=await Job.findOneAndUpdate({_id:jobId},req.body,{new:true,runValidators:true})
    //use .save() method if there are any hooks in the model

    res.status(StatusCodes.OK).json({updateJob})
}
const showStats=async(req,res)=>{
    let stats=await Job.aggregate([
        {$match:{createdBy:mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{_id:'$status',count:{$sum:1}}}
    ])
    stats=stats.reduce((acc,curr)=>{
        const {_id:title,count}=curr
        acc[title]=count
        return acc
    },{})
    const defaultStats={
        pending:stats.pending || 0,
        interview:stats.interview || 0,
        declined:stats.declined || 0
    }
    let monthlyApplications=await Job.aggregate([
        {$match:{createdBy:mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{
            _id:{
                year:{
                    $year:'$createdAt'
                },
                month:{
                    $month:'$createdAt'
                }
            },
            count:{$sum:1}
        }},
        {$sort:{'_id.year':-1,'_id.month':-1}},    
        {$limit:6}
    ])
    monthlyApplications=monthlyApplications.map(item=>{
        const {_id:{year,month},count}=item;
        const date=moment().month(month-1).year(year).format('MMM Y')
        return {date,count}
    }).reverse()

    res.status(StatusCodes.OK).json({defaultStats,monthlyApplications})
}
const deleteJob=async(req,res)=>{
    const {id:jobId}=req.params;
    const job=await Job.findOne({_id:jobId})
    if(!job){
        throw new NotFoundError(`No Job with id ${jobId}`)
    }
    checkPermissions(req.user,job.createdBy)
    await job.remove()
    res.status(StatusCodes.OK).json({msg:"success! Job remove"})
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats };