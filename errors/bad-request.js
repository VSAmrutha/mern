import CustomAPIError from "./custom-api.js" 
import {StatusCodes} from 'http-status-codes'
export default class BadRequestError extends CustomAPIError{
    constructor(message){
        super(message)
        console.log("$$$$$$$$$$",message)
        this.statusCode=StatusCodes.BAD_REQUEST
    }
}