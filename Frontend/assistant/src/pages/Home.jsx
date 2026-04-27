import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userImage from '../assets/user.gif'
import ai from '../assets/ai.gif'
import { CgMenuRight } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';

const Home = () => {

  const { userData, setUserData, serverUrl, getGeminiResponse, } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const sythesis = window.speechSynthesis;
  const isSpeakingRef = useRef(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);
  const hasGreetedRef = useRef(false);

  const handleLogout = async () => {
    try {
      // Fix: logout is defined in userRouter which is mapped to /api/auth in index.js
      await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true });
      toast.success("Logged out successfully!");
      setUserData(null);
      navigate('/login');
    } catch (err) {
      setUserData(null);
      toast.error(err.response?.data?.message  || "Logout failed. Please try again!");
    }
  }
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
 

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response); // Speak the response from Gemini
    // Handle different command types

    switch (type) {

      case "get_date":
      case "get_time":
      case "get_day":
      case "get_month":
      case "general":
        // Just speak response only
        break;
    }
  }


  //for text to speak 

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language to English
    const voices = sythesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
      console.log("Speech finished");
    };

    sythesis.speak(utterance);
  }

  //for wake word detection and continuous listening
  //speech to text and sending to backend and getting response from backend and then speak the response
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
      recognitionRef.current = recognition;
      let isMounted = true; //flag to avoid setState on unmounted component

      //start recogintion after 1 second delay only if component is still mounted and not already recognizing or speaking
      const startTimeout = setTimeout(() => {
        // const safeRecognition = () => {
        if (isMounted && !isRecognizingRef.current && !isSpeakingRef.current) {
          try {
            recognition.start();
            console.log("Speech Recognition started");
          }
          catch (error) {
            if (error.name !== 'InvalidStateError') {
              console.error("Speech Recognition Start Error:", error);
            }
          }
          // }
        }
      }, 1000)
      recognition.onstart = () => {
        isRecognizingRef.current = true;
        setListening(true);
      };
      recognition.onend = () => {
        if (!isMounted) return;
        isRecognizingRef.current = false;
        setListening(false)
        if (isMounted && !isSpeakingRef.current) {
          setTimeout(() => {
            if (isMounted) {
              try {
                recognition.start();
                console.log("Recognition restarted")
              } catch (error) {
                if (error.name !== "InvalidStateError") {
                  console.error("Speech Recognition Restart Error:", error);
                }
              }
            }
          }, 1000)
        }
      }
    recognition.onerror = (event) => {
      console.error("Speech Recognition error:", event.error);
      if (!isMounted) return;
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
          setTimeout(() => {
            if (isMounted && !isRecognizingRef.current && !isSpeakingRef.current) {
              try {
                recognition.start();
                console.log("Recognition restarted after error");
              } catch (error) {
                if (error.name !== "InvalidStateError") {
                  console.error("Speech Recognition Restart Error:", error);
                }
              }
            }
          }, 1000);
        }
    };
    
    recognition.onresult = async (event) => {
      if (!isMounted) return;
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("Recognized Speech:", transcript);


      if (transcript.toLowerCase().includes(userData.user.assistantName.toLowerCase())) {
        console.log("Wake word detected! Calling Gemini...");
        try {
          setAiText("")
          setUserText(transcript)
          recognition.stop(); // Stop recognition while processing the command
          isRecognizingRef.current = false;
          setListening(false);
          const data = await getGeminiResponse(transcript);

          console.log("Gemini Response:", data);
          
          if (data.message === "Token not found" || data.success === false && data.message?.includes("Token")) {
            toast.error("Session expired. Please login again.");
            setUserData(null);
            navigate('/login');
            return;
          }

          if (data.success) {
            // speak(data.response);
            handleCommand(data);
            setAiText(data.response);
            setUserText("");
          }
          else {
            speak(data.message || "Sorry, I couldn't process that.");
            setAiText(data.message || "Sorry, I couldn't process that.");
            setUserText("");
          }

        } catch (error) {
          console.error("Error fetching Gemini response:", error);
          speak("Sorry, there was an error processing your request.");
          setAiText("Sorry, there was an error processing your request.");
          setUserText("");
        }
      }
    };

    console.log(`Assistant ${userData.user.assistantName} is listening...`);

      if (!hasGreetedRef.current) {
        const greeting = new SpeechSynthesisUtterance(`Hello ${userData.user.name}, what can I help you?`);
        greeting.lang = 'hi-IN';
        sythesis.speak(greeting);
        hasGreetedRef.current = true;
      }

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      recognitionRef.current = null;
      isRecognizingRef.current = false;
      console.log("Speech Recognition stopped");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
    }
}, []);


return (
  <div className='w-full relative overflow-x-hidden flex justify-center items-center flex-col min-h-screen bg-gradient-to-t from-[#38383c] py-8 to-[#1816b0]  px-4'>
    <CgMenuRight className={`lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-20`} onClick={() => setToggleMenu(true)} />
    <div className={`absolute top-0 left-0 w-full h-full bg-[#575770bd] backdrop-blur-md p-[30px] flex flex-col gap-6 item-start ${toggleMenu ? "translate-x-0" : "translate-x-full"} transition-transform lg:hidden z-50`}>
      <RxCross2 className='cursor-pointer  lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px]' onClick={() => setToggleMenu(false)} />
      <button onClick={() => navigate('/customize')} className='w-full max-w-[300px] mx-auto text-white px-5 py-3 rounded-full shadow font-semibold border-gray-200 bg-transparent cursor-pointer mt-12 shadow-gray-200' >
        Customize your Assistant
      </button>
      <button onClick={handleLogout} className='w-full max-w-[300px] mx-auto text-white px-5 py-3 rounded-full shadow font-semibold  border-gray-200 bg-transparent cursor-pointer shadow-gray-200'>
        Logout
      </button>
      <hr className='w-full  border-gray-400' />
      <h1 className='text-white font-semibold text-[19px] underline'>History</h1>
     
  <div className='w-full max-w-2xl flex-1 overflow-y-auto flex flex-col gap-3 '>
        {userData?.user?.history && userData.user.history.length > 0 ? (
          userData?.user?.history?.map((his, index) => (
        <div key={index} className='text-white text-[15px] border-b border-white/10 pb-1 flex items-center justify-between'>
          <span > {index+1}. {his}</span>
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

    <button onClick={() => navigate('/customize')} className=' min-w-[150px]  text-white px-5 py-3 rounded-full shadow font-bold hover:border border-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer shadow-gray-200 absolute  hidden lg:block top-10 right-100'>
      Customize your Assistant
    </button>
    <button onClick={handleLogout} className='min-w-[150px]  text-white px-5 py-3 rounded-full shadow font-bold hover:border border-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer shadow-gray-200 absolute  hidden lg:block top-10 right-55'>
      Logout
    </button>
    <button onClick={() => navigate('/history')}  className='min-w-[150px]  text-white px-5 py-3 rounded-full shadow font-bold hover:border border-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer shadow-gray-200 absolute  hidden lg:block top-10 right-10'>
      History
    </button>
    
    <div className='relative flex justify-center items-center mt-10'>
      {/* Spinning AI Rings */}
      <div className='absolute w-[205px] h-[205px] lg:w-[265px] lg:h-[265px] rounded-full border-2 border-transparent border-t-blue-500 border-b-blue-500 animate-spin' style={{ animationDuration: '4s' }}></div>
      <div className='absolute w-[195px] h-[195px] lg:w-[250px] lg:h-[250px] rounded-full border-2 border-transparent border-l-cyan-400 border-r-cyan-400 animate-spin opacity-60' style={{ animationDirection: 'reverse', animationDuration: '2.5s' }}></div>
      
      {/* Assistant Image Container */}
      <div className='w-[180px] h-[180px] lg:w-[230px] lg:h-[230px] rounded-full overflow-hidden shadow-2xl border-4 border-white/10 z-10 bg-black/20'>
        <img src={userData?.user?.assistantImage} alt="assistant" className='h-full w-full object-cover' />
      </div>
    </div>
    <h1 className='text-white text-xl font-semibold py-6 text-center'>
      I am <span className='text-blue-500'>{userData?.user?.assistantName}</span>
    </h1>

    <div className='flex flex-col items-center bg-transparent '>
      {!aiText && <img src={userImage} alt="listening" className='w-[200px] h-[150px] mix-blend-screen' />}
      {aiText && <img src={ai} alt="responding" className='w-[200px]  h-[150px] mix-blend-screen' />}
      <h1 className='text-gray-200 text-[18px] text-center px-4 py-1 '>{userText ? userText : aiText ? aiText : null}</h1>
    </div>

    
  </div>
)
}


export default Home;
