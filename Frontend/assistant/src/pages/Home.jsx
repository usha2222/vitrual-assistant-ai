import React, { useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Fix: logout is defined in userRouter which is mapped to /api/auth in index.js
      await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/login');
    } catch (err) {
      setUserData(null);
      console.error("Logout Error:", err);
    }
  }

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log("Speech Recognition not supported in this browser");
    return;
  }

    // Only start recognition once userData and the assistantName are available
    if (userData?.user?.assistantName) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';

      recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("Recognized Speech:", transcript);

        if (transcript.toLowerCase().includes(userData.user.assistantName.toLowerCase())) {
          console.log("Wake word detected! Calling Gemini...");
          const data = await getGeminiResponse(transcript);
          console.log("Gemini Response:", data);
        }
      };

      console.log(`Assistant ${userData.user.assistantName} is listening...`);
      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, []);

  return (
    <div className='w-full flex justify-center items-center flex-col min-h-screen bg-gradient-to-t from-[#383737] py-8 to-[#0b08cb]'>

      <div className='md:absolute top-[40px] right-[100px] flex justify-end items-center gap-8'>
        <button onClick={() => navigate('/customize')} className='text-white px-5 py-3 rounded-full shadow font-bold'>
          Customize your Assistant
        </button>
        <button onClick={handleLogout} className='text-white px-5 py-3 rounded-full shadow font-bold'>
          Logout
        </button>
      </div>

      <div className='w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden mt-40 shadow-md'>
        <img src={userData?.user?.assistantImage} alt="assistant" className='h-full w-full object-cover' />
      </div>

      <h1 className='text-white text-xl font-semibold py-6'>
        I am <span className='text-blue-500'>{userData?.user?.assistantName}</span>
      </h1>
    </div>
  )
}

export default Home;