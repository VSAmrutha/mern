import { FormRow, Alert ,FormRowSelect} from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
const AddJob = () => {
  const { createJob,clearValues,jobLocation,editJobId, isEditing, company,
  position,jobTypeOptions,jobType,status,statusOptions,showAlert,displayAlert,handleChange,isLoading}=useAppContext()
  const handleJobInput=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    handleChange({name, value})
  }
  const handleSubmit=e=>{
    e.preventDefault();
    if(!position || !company || !jobLocation){
      displayAlert();
      return
    }
    if(isEditing){
      //eventually editjob ()
      return
    }
    createJob()
  }
  return (
   <Wrapper>
     <form className='form'>
    <h3>{isEditing?'edit job':'add job'}</h3>
    {showAlert && <Alert/>}
    <div className='form-center'>
      <FormRow type='text' name='position' value={position} handleChange={(e)=>handleJobInput(e)}/>
      <FormRow type='text' name='company' value={company} handleChange={(e)=>handleJobInput(e)}/>
      <FormRow type='text' name='jobLocation' value={jobLocation} labelText="Job Location" handleChange={(e)=>handleJobInput(e)}/>
      
      <FormRowSelect name='status' value={status} handleChange={handleJobInput} list={statusOptions}/>
      <FormRowSelect labelText='job type' name='jobType' value={jobType} handleChange={handleJobInput} list={jobTypeOptions}/>
      <button className='btn btn-block submit-btn' type='submit' onClick={handleSubmit} disabled={isLoading}>Submit</button>
      <button className='btn btn-block clear-btn' type='submit' onClick={(e)=>{
        e.preventDefault();
        clearValues()
      }}>Clear</button>
     
    </div>
     </form>
   </Wrapper>
  )
}
export default AddJob
