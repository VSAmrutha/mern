import {StatusCodes} from 'http-status-codes'
const errorHandlerMiddleware=(err,req,res,next)=>{
    console.log(err)
    const defaultError={
        statusCodes:StatusCodes.INTERNAL_SERVER_ERROR,
        msg:'Soemthing went wrong try again later'
    }
    if(err.name === 'ValidationError'){
    defaultError.statusCodes=StatusCodes.BAD_REQUEST;
    //defaultError.msg=err.message
    defaultError.msg=Object.values(err.errors).map(item=>item.message).join(', ')
    }
    res.status(defaultError.statusCodes).json({msg:defaultError.msg})
}
export default errorHandlerMiddleware;