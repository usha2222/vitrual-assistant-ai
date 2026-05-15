import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import PageNotFound from './pages/PageNotFound'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import History from './component/History'

const App = () => {
  const {userData,setUserData}=useContext(userDataContext);
   

    return (
      <>
      <ToastContainer
       position="top-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTopa
       closeOnClick
       pauseOnHover
       theme="dark"
     />
    <Routes>
      <Route path='/' element={ // Removed customization check, always go to Home if logged in
        !userData ? <Navigate to="/login" /> : <Home />
      } />
      <Route path='/login' element={ !userData ? <Login /> : <Navigate to='/' /> } />
      <Route path='/register' element={ !userData ? <Register /> : <Navigate to='/' /> } />
      <Route path='*' element={<PageNotFound />} />
      <Route path='/history' element={<History/>}/>
    </Routes>
    </>
  )
}


export default App
