import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Customize from './pages/Customize'
import Home from './pages/Home'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import Customize2 from './pages/Customize2'
import PageNotFound from './pages/PageNotFound'
const App = () => {
  const {userData,setUserData}=useContext(userDataContext);
    return (
    <Routes>
      <Route path='/' element={
        !userData ? <Navigate to="/login" /> :
        (userData.user?.assistantImage && userData.user?.assistantName ? <Home /> : <Navigate to="/customize" />)
      } />
      
      <Route path='/customize' element={ userData ? <Customize/> : <Navigate to='/register' /> } />
          
      <Route path='/customizename' element={ userData ? <Customize2/> : <Navigate to='/register' /> } />
      <Route path='/login' element={ !userData ? <Login /> : <Navigate to='/' /> } />
      <Route path='/register' element={ !userData ? <Register /> : <Navigate to='/' /> } />
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}


export default App
