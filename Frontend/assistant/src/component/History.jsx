import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { MdKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { RxCross2 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import axios from 'axios'

const History = () => {
  const { userData, setUserData, serverUrl } = useContext(userDataContext)
  const navigate = useNavigate()

  const handleDeleteHistory = async (index) => {
    try {
      const response = await axios.post(`${serverUrl}/user/delete-history`, { index }, { withCredentials: true });
      if (response.data.success) {
        setUserData(response.data);
        toast.success("History deleted successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete history");
    }
  }
  return (
    <div className='w-full relative overflow-x-hidden min-h-screen bg-gradient-to-t from-[#4a4a4e] py-8 to-[#1f1cca] px-4 py-8 flex flex-col items-center'>
      <button onClick={() => navigate('/')} className='absolute top-[30px] left-[30px] text-white w-[40px] h-[40px] cursor-pointer rounded-full shadow items-center flex justify-center shadow-gray-400 font-bold'>
        <MdKeyboardBackspace  size={20} />
      </button>
      <h1 className='text-white text-[27px] mb-8 font-semibold text-center pt-10'>Conversation <span className='text-blue-400'>History</span></h1>
      <div className='w-full max-w-2xl flex-1 overflow-y-auto flex flex-col gap-3 '>
        {userData?.user?.history && userData.user.history.length > 0 ? (
          userData.user.history.map((his, index) => (
            <div key={index} className='text-white text-[15px] flex items-center justify-between bg-white/8 backdrop-blur-sm p-2.5 rounded-xl  border border-gray-500 '>
               <span> {index+1}. {his} </span>
               <div className='rounded-full border p-1 shadow-md shadow-gray-600  '>
               <RxCross2 className='cursor-pointer hover:text-red-400 transition-colors' onClick={() => handleDeleteHistory(index)} />
               </div>
            </div>
        
          ))
        ) : (   
          <p className='text-gray-300 text-xl text-center mt-10'>No history found.</p>
        )}
      </div>
    </div>
  )
}

export default History
