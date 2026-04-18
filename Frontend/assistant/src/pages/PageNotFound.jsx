import React from 'react'
import { useNavigate } from 'react-router-dom';
const PageNotFound = () => {
    const navigate = useNavigate();
  return (
    <div className='w-full min-h-screen  flex justify-center flex-col bg-gradient-to-t from-[#383737] py-8 to-[#0b08cb]   py-8 items-center to-[#4141c5] '>
                <h1 className='text-white text-[25px] mb-6 font-semibold text-center pt-5 text-2xl'>404 <span className='text-blue-500 text-4xl'>Page Not Found</span></h1>
                <p className='text-white text-[22px] text-center'>The page you are looking for does not exist.</p>
                 <button type="submit" onClick={()=>navigate("/")} className=' w-44 cursor-pointer flex justify-center align-center items-center mx-auto my-8  h-[50px] text-black bg-white font-semibold  rounded-full text-[19px] outline-none border font-bold border-gray-200 bg-transparent' >Back to home</button>
    </div>
  )
}

export default PageNotFound
