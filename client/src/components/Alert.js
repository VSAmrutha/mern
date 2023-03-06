import React from 'react'
import { useAppContext } from '../context/appContext'

const Alert = () => {
  const {alertType,alertText}=useAppContext()
  console.log("alertText",alertText)
  return (
    <div className={`alert alert-${alertType}`}>{alertText}</div>
  )
}

export default Alert