

const FormRow = ({handleChange,name ,value ,labelText,type}) => {
  return (
    <div className='form-row'>
       <label htmfor={name} className="form-label">{labelText || name}</label>
        <input type={type} className="form-input" value={value} name={name} onChange={handleChange}/>
    </div>
  )
}
export default FormRow
