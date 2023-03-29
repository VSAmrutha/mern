import {StatusCodes} from 'http-status-codes'
import Job from "../models/Jobs.js"
import {BadRequestError,NotFoundError, UnauthenticatedError} from "../errors/index.js"
import {checkPermissions} from '../utils/index.js'
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
    const jobs=await Job.find({createdBy:req.user.userId})
    res.status(StatusCodes.OK).json({jobs,totalJobs:jobs.length,numOfPages:1})
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
    res.status(StatusCodes.OK).json("showStats")
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