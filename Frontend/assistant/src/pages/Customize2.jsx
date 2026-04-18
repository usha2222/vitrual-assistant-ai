import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdKeyboardBackspace } from 'react-icons/md';


const Customize2 = () => {
const {userData,backEndImage,seletectedImage,setUserData,serverUrl}=useContext(userDataContext);
const navigate = useNavigate();

    const [assistantName, setAssistantName] = useState(userData?.assistantName || '');
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
        const result=await axios.post(`${serverUrl}/api/user/update-assistant`, formdata,{ withCredentials: true });
        console.log(result.data);
        setUserData(result.data);
        navigate('/');
    }
    catch(e){
        console.error('Error creating assistant:', e);
        setLoading(false);
    }
}
  return (
        <div className='w-full flex flex-col min-h-screen bg-gradient-to-t from-[#383737] py-8 to-[#0b08cb] '>
            <button onClick={() => navigate('/customize')} className='absolute top-[30px] left-[30px]  text-white w-[40px] h-[40px]   cursor-pointer rounded-full  shadow    items-center flex justify-center shadow-gray-400 font-bold  '>
                <MdKeyboardBackspace size={20} />
                
            </button>
            <h1 className='text-white mt-8 text-[25px] mb-6 font-semibold text-center pt-20'>Enter Your <span className='text-blue-500'>Virtual Assistant Name</span></h1>

             <input className=' w-92 flex justify-center mx-auto h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type="text" placeholder='Enter your Assistant Name eg. Alex,Shiri,Nexa......' value={assistantName} onChange={(e) => setAssistantName(e.target.value)} required />
  {assistantName && (
    <button type="submit" disabled={loading} className=' w-80 cursor-pointer flex justify-center align-center items-center mx-auto my-8  h-[50px] text-black bg-white font-semibold  rounded-full text-[19px] outline-none border font-bold border-gray-200 bg-transparent' onClick={handleAssistantCreation} >
        {loading ? "Creating..." : "Finally Create Your Assistant"}
    </button>
  )}
            </div>
  )
}

export default Customize2
