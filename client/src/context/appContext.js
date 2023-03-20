import React,{ useReducer,useEffect,useContext} from 'react';
import reducer from "./reducer";
import axios from 'axios';
import { CREATE_JOB_BEGIN,CREATE_JOB_SUCCESS,CREATE_JOB_ERROR,CLEAR_VALUES,HANDLE_CHANGE,DISPLAY_ALERT ,CLEAR_ALERT,SETUP_USER_BEGIN,SETUP_USER_SUCCESS,SETUP_USER_ERROR,TOGGLE_SIDEBAR,LOGOUT_USER,UPDATE_USER_BEGIN,UPDATE_USER_SUCCESS,UPDATE_USER_ERROR} from "./action";

const token=localStorage.getItem('token')
const user=localStorage.getItem('user')
const userLocation=localStorage.getItem('location')
const initialState={
    isLoading:false,
    showAlert:false,
    alertText:'',
    alertType:'',
    user:user?JSON.parse(user):null,
    token:token,
    userLocation:userLocation || '',
    showSidebar:false,
    jobLocation:userLocation || '',
    editJobId:'',
    isEditing:'',
    company:'',
    position:'',
    jobTypeOptions:['full-time','part-time','remote','internship'],
    jobType:'full-time',
    status:'pending',
    statusOptions:['pending','interviewed','declined']

}
const AppContext=React.createContext();

const AppProvider=({children})=>{
    const [state,dispatch]=useReducer(reducer,initialState);
    const authFetch=axios.create({
        baseURL:'/api/v1',
    })
    //Interceptors: request
    authFetch.interceptors.request.use((config)=>{
        config.headers['Authorization']=`Bearer ${state.token}`
        return config
    },(err)=>{
        return Promise.reject(err)
    })
     //Interceptors: response
     authFetch.interceptors.response.use((response)=>{  
        return response
    },(err)=>{
        console.log(err.response)
        if(err.response.status===401){
           logoutUser();
        }
        return Promise.reject(err)
    })
    const displayAlert=()=>{
        dispatch({type:DISPLAY_ALERT})
        clearAlert()
    }
    const clearAlert=()=>{
        setTimeout(()=>{
            dispatch({type:CLEAR_ALERT})
        },3000)
        
    }
    const addUserToLocalStorage=({user,token,location})=>{
        localStorage.setItem('user',JSON.stringify(user))
        localStorage.setItem('token',token)
        localStorage.setItem('location',location)
    }
    const removeUserFromLocalStorage=()=>{
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')
    }
    
    const setupUser=async({currentUser,endPoint,alertText})=>{
        dispatch({type:SETUP_USER_BEGIN})
        try{
            const {data}=await axios.post(`/api/v1/auth/${endPoint}`,currentUser);
            const {user,token,location}=data;
            dispatch({type:SETUP_USER_SUCCESS,payload:{user,token,location,alertText}})
            addUserToLocalStorage({user,token,location})
        }catch(err){
            if(err.response.status!==401){
                dispatch({type:SETUP_USER_ERROR,payload:{msg:err.response.data.msg}})
            }
            
        }
        clearAlert()
    }
    const toggleSidebar=()=>{
        dispatch({type:TOGGLE_SIDEBAR})
    }
    const logoutUser=()=>{
        dispatch({type:LOGOUT_USER})
        removeUserFromLocalStorage()
    }
    const updateUser=async(currentUser)=>{
        dispatch({type:UPDATE_USER_BEGIN})
        try{
            const {data}=await authFetch.patch('/auth/updateUser',currentUser)
            const {user,location,token}=data;
            dispatch({type:UPDATE_USER_SUCCESS,payload:{user,location,token}})
            addUserToLocalStorage({user,token,location})
    }catch(err){
        dispatch({type:UPDATE_USER_ERROR,payload:{msg:err.response.data.msg}})
    }
    clearAlert()
    }
    const handleChange=({name,value})=>{
        dispatch({type:HANDLE_CHANGE,payload:{name,value}})
    }
    const clearValues=()=>{
        dispatch({type:CLEAR_VALUES})
    }
    const createJob=async()=>{
        dispatch({type:CREATE_JOB_BEGIN});
        try{
            const {position,company,jobLocation,jobType,status}=state;
            await authFetch.post('/jobs',{position,company,jobLocation,jobType,status});
            dispatch({type:CREATE_JOB_SUCCESS})
            dispatch({type:CLEAR_VALUES})
        }catch(err){
            if(err.response.status===401){
                return
            }
            dispatch({type:CREATE_JOB_ERROR,payload:{msg:err.response.data.msg}})
        }
        clearAlert()

    }
    return <AppContext.Provider value={{...state,displayAlert,clearAlert,setupUser,toggleSidebar,logoutUser,updateUser,handleChange,clearValues,createJob}}>
        {children}
    </AppContext.Provider>
}
const useAppContext=()=>{
    return useContext(AppContext)
}
export {AppProvider,initialState,useAppContext}