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
    const query = userInput || response;
    if (type === "google_search") {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    } else if (type === "youtube_search") {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
    } else if (type === "wikipedia_search") {
      window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`, '_blank');
    } else if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    } else if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather+in+${encodeURIComponent(query)}`, '_blank');
    } else if (type === "news") {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}+news`, '_blank');
    } else if (type === "instagram_search") {
      window.open(`https://www.instagram.com/${encodeURIComponent(query)}`, '_blank');
    } else if (type === "linkedin_search") {
      window.open(`https://www.linkedin.com/in/${encodeURIComponent(query)}`, '_blank');
    } else if (type === "twitter_search") {
      window.open(`https://twitter.com/${encodeURIComponent(query)}`, '_blank');
    } else if (type === "facebook_search") {
      window.open(`https://www.facebook.com/${encodeURIComponent(query)}`, '_blank');
    } else if (type === "email_check") {
      window.open(`https://mail.google.com/mail/u/0/#inbox`, '_blank');
    } else if (type === "calendar_check") {
      window.open(`https://calendar.google.com/calendar/u/0/r`, '_blank');
    } else if (type === "map_search") {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
    } else if (type === "music_play" || type === "video_play") {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
    }

  }


  //for text to speak 

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Set language to Hindi (India)
    const voices = sythesis.getVoices();
    const hindiVoice = voices.find(voice => voice.lang === 'hi-IN' || voice.lang.startsWith('hi'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;

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
      if (event.error === 'aborted') {
        console.log("Recognition aborted, ignoring restart attempt to prevent loop.");
        return;
      }
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted")
            }catch(error){
              if(error.name!=="InvalidStateError") {
                  console.error("Speech Recognition Restart Error:", error);
                }
              }
            }
            } , 1000)
            }

      }
    

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
  <div className='w-full relative overflow-x-hidden flex justify-center items-center flex-col min-h-screen bg-gradient-to-t from-[#38383c] py-8 to-[#0b08cb]  px-4'>
    <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer' onClick={() => setToggleMenu(true)} />
    <div className={`absolute  top-0 w-full h-full bg-[#514a4a53] backdrop-blur-lg p-[30px] flex flex-col gap-6 item-start ${toggleMenu ? "translate-x-0" : "translate-x-full"} transition-transform lg:hidden `}>
      <RxCross2 className='cursor-pointer  lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px]' onClick={() => setToggleMenu(false)} />
      <button onClick={() => navigate('/customize')} className=' w-92 mx-auto text-white px-5 py-3 rounded-full shadow font-bold hover:border border-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer shadow-gray-200 mt-12' >
        Customize your Assistant

      </button>
      <button onClick={handleLogout} className='w-92 mx-auto  text-white px-5 py-3 rounded-full shadow font-bold hover:border border-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer shadow-gray-200 '>
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
    <div className='w-[180px] h-[180px] lg:w-[240px] lg:h-[240px] rounded-full overflow-hidden mt-10 shadow-md'>
      <img src={userData?.user?.assistantImage} alt="assistant" className='h-full w-full object-cover' />
    </div>
    <h1 className='text-white text-xl font-semibold py-6'>
      I am <span className='text-blue-500'>{userData?.user?.assistantName}</span>
    </h1>

    <div className='flex flex-col items-center bg-transparent '>
      {!aiText && <img src={userImage} alt="listening" className='w-[200px] h-[150px] mix-blend-screen' />}

      {aiText && <img src={ai} alt="responding" className='w-[200px]  h-[150px] mix-blend-screen' />}
      <h1 className='text-gray-200 text-[18px]  py-1 '>{userText ? userText : aiText ? aiText : null}</h1>
    </div>
  </div>
)
}


export default Home;
