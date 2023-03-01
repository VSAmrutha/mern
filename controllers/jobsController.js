import {StatusCodes} from 'http-status-codes'

const createJob=async(req,res)=>{
    res.status(StatusCodes.CREATED).json("createJob")
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