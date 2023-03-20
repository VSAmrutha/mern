import {StatusCodes} from 'http-status-codes'
import Job from "../models/Jobs.js"
import {BadRequestError,NotFoundError, UnauthenticatedError} from "../errors/index.js"

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
    res.status(StatusCodes.OK).json("getAllJobs")
}
const updateJob=async(req,res)=>{
    res.status(StatusCodes.OK).json("updateJob")
}
const showStats=async(req,res)=>{
    res.status(StatusCodes.OK).json("showStats")
}
const deleteJob=async(req,res)=>{
    res.status(StatusCodes.OK).json("deleteJob")
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats };