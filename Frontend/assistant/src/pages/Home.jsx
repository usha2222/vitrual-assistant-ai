import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userImage from '../assets/user.gif'
import ai from '../assets/ai.gif'
const Home = () => {
  const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const sythesis = window.speechSynthesis;
  const isSpeakingRef = useRef(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
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
const hindiVoice=voices.find(voice=>voice.lang==='hi-IN' || voice.lang.startsWith('hi'));
if(hindiVoice){
  utterance.voice=hindiVoice;
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
      const isRecognizingRef = { current: false }

      const safeRecognition = () => {
        recognition.onstart = () => {
          console.log("Speech Recognition started");
          isRecognizingRef.current = true;
          setListening(true);
        };
        recognition.onend = () => {
          // console.log("Speech Recognition ended");
          isRecognizingRef.current = false;
          setListening(false);
        };
        recognition.onerror = (event) => {
          if (event.error === 'aborted') {
            console.log("Speech Recognition aborted (likely due to overlap or manual stop).");
          } else {
            console.error("Speech Recognition error:", event.error);
          }
          isRecognizingRef.current = false;
          setListening(false);
          if (event.error !== 'not-allowed' && event.error !== 'service-not-allowed' && event.error !== 'aborted') {
            setTimeout(() => {
              safeRecognition();
            }, 1000);
          }
        }

        recognition.onresult = async (event) => {
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
              if (data.success) {
                // speak(data.response);
                handleCommand(data);
                setAiText(data.response)
                setUserText(" ");
              }
              else {
                speak(data.message || "Sorry, I couldn't process that.");
              }
            } catch (error) {
              console.error("Error fetching Gemini response:", error);
            }
          }
        };

        if (!isRecognizingRef.current && !isSpeakingRef.current) {
          try {
            recognition.start();
          } catch (err) {
            if (err.name !== 'InvalidStateError') console.error(err);
          }
        }
      };

      const interval = setInterval(() => {
        if (!isRecognizingRef.current && !isSpeakingRef.current) {
          safeRecognition();
        }
      }, 1000);

      safeRecognition();
      console.log(`Assistant ${userData.user.assistantName} is listening...`);

      return () => {
        clearInterval(interval);
        recognition.stop();
        setListening(false);
        recognitionRef.current = null;
        isRecognizingRef.current = false;
        console.log("Speech Recognition stopped");
      };
    }
  }, []);


  return (
    <div className='w-full flex justify-center items-center flex-col min-h-screen bg-gradient-to-t from-[#38383c] py-8 to-[#0b08cb]'>

      <div className='md:absolute top-[40px] right-[100px] flex justify-end items-center gap-8'>
        <button onClick={() => navigate('/customize')} className='text-white px-5 py-3 rounded-full shadow font-bold hover:border border-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer shadow-gray-200'>
          Customize your Assistant
        </button>
        <button onClick={handleLogout} className='text-white px-5 py-3 rounded-full shadow font-bold hover:border border-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer shadow-gray-200'>
          Logout
        </button>
      </div>

      <div className='w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden mt-30 shadow-md'>
        <img src={userData?.user?.assistantImage} alt="assistant" className='h-full w-full object-cover' />
      </div>

      <h1 className='text-white text-xl font-semibold py-6'>
        I am <span className='text-blue-500'>{userData?.user?.assistantName}</span>
      </h1>

    <div className='flex flex-col items-center bg-transparent '>
        {!aiText && <img src={userImage} alt="listening" className='w-[200px] h-[150px] mix-blend-screen' />}
        
        {aiText && <img src={ai} alt="responding" className='w-[200px]  h-[150px] mix-blend-screen' />}
<h1 className='text-gray-200 text-xl  py-1 '>{userText?userText:aiText?aiText:null}</h1>
</div>
    </div>
  )
}


export default Home;
