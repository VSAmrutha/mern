import {useState,useEffect} from 'react';
import {Logo,FormRow,Alert} from "../components";
import Wrapper from "../assets/wrappers/RegisterPage"
import { useAppContext } from '../context/appContext';
import {useNavigate} from 'react-router-dom'
const initialState={
    name:"",
    email:"",
    password:"",
    isMember:true,
}

const Register = () => {
    const [values,setValues]=useState(initialState);
    const navigate=useNavigate()
    const {user, isLoading,showAlert,displayAlert,registerUser}=useAppContext()

    const toggleMember=()=>{
        setValues({...values,isMember:!values.isMember})
        
    }
    const handleChange=(e)=>{
        setValues({...values,[e.target.name]:e.target.value})
    }
    const onSubmit=(e)=>{
        e.preventDefault();
        const {name,email,password,isMember}=values
       if(!email || !password || (!isMember && !name)){
        displayAlert()
        return
       }
       const currentUser={name,email,password}
       if(isMember){
           console.log("already a member")
       }else{
           registerUser(currentUser)
       }

    }
    useEffect(()=>{
        if(user){
            setTimeout(()=>{
                navigate('/')
            },3000)
        }
    },[user,navigate])
    return (
     <Wrapper className='full-page'>
        <form className='form' onSubmit={onSubmit}>
            <Logo/>
            <h3>{values.isMember ?"Login":"Register"}</h3>
          {showAlert && <Alert/>} 
          {!values.isMember &&
               <FormRow handleChange={handleChange} value={values.name} labelText="Name" name="name" type="text"/>}
               <FormRow handleChange={handleChange} value={values.email} labelText="Email" name="email" type="email"/>
               <FormRow handleChange={handleChange} value={values.password} labelText="Password" name="password" type="password"/>
            
            <button type="submit" className='btn btn-block' disabled={isLoading}>Submit</button>
           <p>{values.isMember?'Not a member yet?':'Already a member?'}
               <button type="button" onClick={toggleMember} className="member-btn">{values.isMember?'Register':'Login'}</button>
           </p>

        </form>
     </Wrapper>
    )
  }
  export default Register
  