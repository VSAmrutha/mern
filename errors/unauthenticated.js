import CustomAPIError from "./custom-api.js" 
import {StatusCodes} from 'http-status-codes'
export default class Unathenticated extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}