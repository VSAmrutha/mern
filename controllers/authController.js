import User from "../models/User.js"
import {StatusCodes} from 'http-status-codes'
import {BadRequestError,NotFoundError, UnauthenticatedError} from "../errors/index.js"

const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new BadRequestError('Please provide all values')
    }
    const userAlreadyExists=await User.findOne({email})
    if(userAlreadyExists){
        throw new BadRequestError('Email already exists')
    }
    const user = await User.create({name,email,password})
    const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.name,email:user.email,lastName:user.lastName,location:user.location},token}) 
}
const login=async(req,res)=>{
    const {email,password}=req.body;
    if( !email || !password){
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({email}).select('+password')
    if( !user ){
        throw new UnauthenticatedError('Invalid credentials')
    }
    const passwordMatch= await user.comparePassword(password)
    if(!passwordMatch){
        throw new UnauthenticatedError('Incorrect Crendentilas')
    }
    const token=user.createJWT()
    user.password=undefined
    //const oneDay=1000*24*60*60
    //res.cookie('token',token,{
    //    httpOnly:true,
    //    expires:new Date(Date.now()+oneDay),
    //    secure:process.env.NODE_ENV==='production'
    //})
    res.status(StatusCodes.OK).json({user,token,location:user.location})
}
const updateUser=async(req,res)=>{
    const {email,name,lastName,location}=req.body;
    if(!email || !name || !lastName || !location){
        throw new BadRequestError('Please provide all values')
    }
    const user=await User.findOne({_id:req.user.userId})
    user.email=email;
    user.name=name;
    user.lastName=lastName;
    user.location=location;
// since we are not updating email,name while creating jwt we don need to create token, upto you
    await user.save();
    const token=user.createJWT();
    res.status(StatusCodes.OK).json({user,token,location:user.location})
}

export {register, login, updateUser};