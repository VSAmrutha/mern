import {StatusCodes} from 'http-status-codes';

const errorHandlerMiddleware=(err,req,res,next)=>{
    console.log("ee^&&&&&&&&&&&&&&",err)
    const defaultError={
        statusCodes:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message || 'Soemthing went wrong try again later'
    }

    if(err.name === 'ValidationError'){
    defaultError.statusCodes=StatusCodes.BAD_REQUEST;
    //defaultError.msg=err.message
    defaultError.msg=Object.values(err.errors).map(item=>item.message).join(', ')
    }
    if(err.code && err.code===11000){
        defaultError.statusCodes=StatusCodes.BAD_REQUEST;
        defaultError.msg=`${Object.keys(err.keyValue)} field has to be unique`
    }
    res.status(defaultError.statusCodes).json({msg:defaultError.msg})
}
export default errorHandlerMiddleware;