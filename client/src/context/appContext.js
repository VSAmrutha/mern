import React,{ useReducer,useContext} from 'react';
import reducer from "./reducer";
import axios from 'axios';
import { CHANGE_PAGE,CLEAR_FILTERS,SHOW_STATS_BEGIN,SHOW_STATS_SUCCESS,EDIT_JOB_BEGIN,EDIT_JOB_SUCCESS,EDIT_JOB_ERROR,DELETE_JOB_BEGIN,SET_EDIT_JOB,GET_JOBS_BEGIN,GET_JOBS_SUCCESS,CREATE_JOB_BEGIN,CREATE_JOB_SUCCESS,CREATE_JOB_ERROR,CLEAR_VALUES,HANDLE_CHANGE,DISPLAY_ALERT ,CLEAR_ALERT,SETUP_USER_BEGIN,SETUP_USER_SUCCESS,SETUP_USER_ERROR,TOGGLE_SIDEBAR,LOGOUT_USER,UPDATE_USER_BEGIN,UPDATE_USER_SUCCESS,UPDATE_USER_ERROR} from "./action";

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
    //job related state
    jobLocation:userLocation || '',
    editJobId:'',
    isEditing:'',
    company:'',
    position:'',
    jobTypeOptions:['full-time','part-time','remote','internship'],
    jobType:'full-time',
    status:'pending',
    statusOptions:['pending','interview','declined'],
    // pagination, getAllJobs
    jobs:[],
    totalJobs:0,
    numOfPages:1,
    page:1,
    //stats
    stats:{},
    monthlyApplications:[],
    //search and sort
    search:'',
    searchStatus:'all',
    searchType:'all',
    sort:'latest',
    sortOptions:['latest','oldest','a-z','z-a']

}
const AppContext=React.createContext();

const AppProvider=({children})=>{
    const [state,dispatch]=useReducer(reducer,initialState);
    const authFetch=axios.create({
        baseURL:'http://localhost:5000/api/v1',
    })
    // baseURL:'/api/v1',
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
            const {data}=await authFetch.post(`/auth/${endPoint}`,currentUser);
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
        console.log("test")
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
    const getJobs=async()=>{
        const {search,searchStatus,searchType,sort,page}=state;

        let url=`/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if(search){
            url=url+`&search=${search}`
        }
        dispatch({type:GET_JOBS_BEGIN})
        try{
            const {data}=await authFetch(url);
            const {jobs,totalJobs,numOfPages}=data
            dispatch({type:GET_JOBS_SUCCESS,payload:{jobs,totalJobs,numOfPages}})
        }catch(err){
        //   console.log(err) 
             logoutUser()
        }
        clearAlert()
    }
    const setEditJob=(id)=>{
        dispatch({type:SET_EDIT_JOB,payload:{id}})
    }
    const editJob=async()=>{
        dispatch({type:EDIT_JOB_BEGIN})
        try{
            const {position,company,jobLocation,status,jobType}=state;
            await authFetch.patch(`/jobs/${state.editJobId}`,{position,company,jobLocation,status,jobType});
            dispatch({type:EDIT_JOB_SUCCESS})
            dispatch({type:CLEAR_VALUES})
        }catch(err){
            console.log(err)
            if(err.response.status===401) return
            dispatch({EDIT_JOB_ERROR,payload:{msg:err.response.data.msg}})
        }
        clearAlert()
    }
    const deleteJob=async(jobId)=>{
     dispatch({type:DELETE_JOB_BEGIN})
       try{
        await authFetch.delete(`/jobs/${jobId}`);
        getJobs()
       }catch(err){
        console.log("err")
        logoutUser()
       }
    }
    const showStats=async()=>{
        dispatch({type:SHOW_STATS_BEGIN})
        try{
            const {data}=await authFetch('/jobs/stats')
            dispatch({type:SHOW_STATS_SUCCESS,payload:{stats:data.defaultStats,monthlyApplications:data.monthlyApplications}})
        }catch(err){
            logoutUser()
        }
    }
    const clearFilters=()=>{
       dispatch({type:CLEAR_FILTERS})
    }
    const changePage=(page)=>{
        dispatch({type:CHANGE_PAGE,payload:{page}})
    }
    return <AppContext.Provider value={{...state,displayAlert,clearAlert,setupUser,toggleSidebar,logoutUser,updateUser,handleChange,clearValues,createJob,getJobs,setEditJob,deleteJob,editJob,showStats,clearFilters,changePage}}>
        {children}
    </AppContext.Provider>
}
const useAppContext=()=>{
    return useContext(AppContext)
}
export {AppProvider,initialState,useAppContext}