import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const {userData,setUserData,serverUrl}=useContext(userDataContext);
  const navigate=useNavigate();
  const handleLogout=async()=>{
    try{
      const response=await axios.get(`${serverUrl}/user/logout`,{withCredentials:true});
      setUserData(null);
      navigate('/login');
    }
    catch(err){
      setUserData(null);
      console.error("Logout Error:", err);
  }
}
  console.log(userData);
  console.log(userData.user.assistantImage);
  return (
      <div className='w-full flex jus
      tify-center items-center flex-col min-h-screen bg-gradient-to-t from-[#383737] py-8 to-[#0b08cb] '>

        <div className='absolute top-[30px] right-[30px] flex justify-end items-center gap-6'>
            <button onClick={()=>navigate('/customize')} className=' text-white    cursor-pointer rounded-full  shadow    items-center flex justify-center shadow-gray-400 font-bold px-5 py-3 '>Customize your Assistant</button>
            <button onClick={handleLogout} className='  text-white px-5 py-3    cursor-pointer rounded-full  shadow    items-center flex justify-center shadow-gray-400 font-bold  '>Logout</button>
        </div>
    
<div className='w-[300px] h-[400px] flex justify-center items-center flex-col overflow-hidden rounded-2xl  mt-20 shadow shadow-gray-200'>
  <img src={userData?.user?.assistantImage} alt="assistantImage" className='h-full w-full object-cover rounded-2xl' />

</div>
<h1 className='text-white text-xl font-semibold py-3 '>I am <span className='text-blue-500'>{userData?.user?.assistantName}</span></h1>
      </div>
  )
}

export default Home
