
import {AddJob,AllJobs,Stats,SharedLayout,Profile} from './pages/dashboard'

import {Landing,Register,Error,ProtectedRoute} from './pages'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  return (
    <div >
    {/* "proxy":"http://localhost:5000" */}
    <BrowserRouter>
      <Routes>
      <Route path="/" element={
        <ProtectedRoute>
      <SharedLayout/>
      </ProtectedRoute>
      }>
      {/* Add index makes it as default show page for / path */}
        <Route index element={<Stats/>}/>
        <Route path="all-jobs" element={<AllJobs/>}/>
        <Route path="add-job" element={<AddJob/>}/>
        <Route path="profile" element={<Profile/>}/>
      </Route>
      <Route path="/register" element={<Register/>}/>
      <Route path="/landing" element={<Landing/>}/>
      <Route path="*" element={<Error/>}/>
      
      </Routes>
    </BrowserRouter>
     
    </div>
  );
}

export default App;
//,"proxy":"http://localhost:5000"