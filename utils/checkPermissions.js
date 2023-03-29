import {UnauthenticatedError} from "../errors/index.js"
const CheckPermissions=(requestUser,resourceUserId)=>{
    //if(requestUser.role==='admin') return
    if(requestUser.userId===resourceUserId.toString()) return;
    throw new UnauthenticatedError(`Not authorized to access this route`)
}
export default CheckPermissions;