import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdKeyboardBackspace } from 'react-icons/md';
import { toast } from 'react-toastify';

const Customize2 = () => {
const {userData,backEndImage,seletectedImage,setUserData,serverUrl}=useContext(userDataContext);
const navigate = useNavigate();

    const [assistantName, setAssistantName] = useState(userData?.user?.assistantName || '');
    const [loading, setLoading] = useState(false);

const handleAssistantCreation =async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
        let formdata=new FormData();
        formdata.append('assistantName',assistantName);
        if(backEndImage){
            formdata.append('assistantImage',backEndImage);
        }

        else{
            formdata.append("imageUrl",seletectedImage);
        }
        const result=await axios.post(`${serverUrl}/user/update-assistant`, formdata,{ withCredentials: true });
        console.log(result.data);
        setUserData(result.data);
        toast.success(userData?.user?.assistantName ? "Assistant updated successfully!" : "Assistant created successfully!");
        navigate('/');
    }
    catch(e){
        console.error('Error creating assistant:', e);
        setLoading(false);
        toast.error(e.response?.data?.message || "Failed to save assistant settings.");
    }
}
  return (
        <div className='w-full relative overflow-hidden flex flex-col min-h-screen bg-gradient-to-t from-[#383737] to-[#0b08cb] px-4'>
            <button onClick={() => navigate('/customize')} className='absolute top-[20px] left-[20px] md:top-[30px] md:left-[30px] text-white w-[40px] h-[40px] cursor-pointer rounded-full shadow items-center flex justify-center shadow-gray-400 font-bold'>
                <MdKeyboardBackspace size={20} />
            </button>
            <h1 className='text-white mt-16 md:mt-8 text-[22px] md:text-[25px] mb-6 font-semibold text-center pt-10 md:pt-20'>{userData?.user?.assistantName ? "Update Your" : "Enter Your"} <span className='text-blue-500'>Virtual Assistant Name</span></h1>

             <input className='w-full max-w-[400px] flex justify-center mx-auto h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type="text" placeholder='eg. Alex, Shiri, Nexa...' value={assistantName} onChange={(e) => setAssistantName(e.target.value)} required />
  {assistantName && (
    <button type="submit" disabled={loading} className='w-full max-w-[320px] cursor-pointer flex justify-center items-center mx-auto my-8 h-[50px] text-black bg-white font-semibold rounded-full text-[17px] md:text-[19px] outline-none border font-bold border-gray-200' onClick={handleAssistantCreation} >
        {loading ? (userData?.user?.assistantName ? "Updating..." : "Creating...") : (userData?.user?.assistantName ? "Update Your Assistant" : "Create Your Assistant")}
    </button>
  )}
            </div>
  )
}

export default Customize2
