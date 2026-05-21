import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userImage from '../assets/user.gif'
import ai from '../assets/ai.gif'
import { CgMenuRight } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';
import Footer from '../component/Footer';
import sditslogo from '../assets/sditslogo.png'
import { MdHistory } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import backgroundImage from '../assets/purplebg.png'
import { ShieldUser } from 'lucide-react';
import headerlogo from '../assets/header.png'

const Home = () => {

  const { userData, setUserData, serverUrl, askAssistant, } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isProcessingRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const sythesis = window.speechSynthesis;
  const isSpeakingRef = useRef(false); // This ref is used to track if the assistant is speaking
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);
  const hasGreetedRef = useRef(false);
  const [preferredModel, setPreferredModel] = useState("Gemini");
  const [showPayButton, setShowPayButton] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [aiErrorOccurred, setAiErrorOccurred] = useState(false); // New state to track AI errors
  
  // Fix closure bug: Speech recognition needs to know the current model without restarting the effect
  const preferredModelRef = useRef(preferredModel);
  useEffect(() => {
    preferredModelRef.current = preferredModel;
  }, [preferredModel]);


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradeAndSwitch = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      setIsPaying(true);
      const { data: orderData } = await axios.post(`${serverUrl}/payment/create-order`, { amount: 499 }, { withCredentials: true });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Premium AI Access",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const { data: verifyData } = await axios.post(`${serverUrl}/payment/verify-payment`, response, { withCredentials: true });
            if (verifyData.success) {
              toast.success("Payment Successful! Switching to Groq...");
              // Sync local state with the actual data from database
              setUserData({ ...userData, user: verifyData.user });
              setPreferredModel("Groq");
              setShowPayButton(false);
            } else {
              toast.error(verifyData.message || "Payment verification failed.");
            }
          } catch (verifyError) {
            toast.error("An error occurred during verification. Please contact support.");
          } finally {
            setIsPaying(false);
          }
        },
        modal: { ondismiss: () => setIsPaying(false) },
        theme: { color: "#3b82f6" }
      };
      new window.Razorpay(options).open();
    } catch (error) {
      toast.error("Payment failed to initialize.");
      setIsPaying(false);
    }
  };

  // Effect to manage showPayButton based on premium status
  useEffect(() => {
    if (userData && !userData.user.isPremium) {
      // Show button if not premium and (history limit of 10 reached OR an AI error occurred)
      if (userData.user.history.length >= 15 || aiErrorOccurred) {
        setShowPayButton(true);
      } else {
        setShowPayButton(false);
      }
    } else {
      // If user is premium, we hide the button. 
      // We only reset aiErrorOccurred if they are premium to allow them to retry
      // or if they just finished paying.
      setShowPayButton(false);
      setAiErrorOccurred(false);
    }
  }, [userData, aiErrorOccurred]); // Add aiErrorOccurred to dependencies

  const handleModelFailure = (error) => {
    const errorMessage = error?.response?.data?.message || error?.message || "An unexpected error occurred.";
    if (!userData?.user?.isPremium) {
      setAiErrorOccurred(true); // Set the flag when an AI error occurs for non-premium users
      
      let msg = `${preferredModelRef.current} is currently busy. Upgrade to unlock backup models.`;
      
      if (errorMessage.includes("exhausted")) {
        msg = errorMessage;
      } else if (errorMessage.includes("limit") || errorMessage.includes("unavailable")) {
        msg = "Gemini limit reached. Please Upgrade to Premium to switch to backup engines.";
      }

      if (!isSpeakingRef.current) speak(msg); // Only speak if not already speaking
      setAiText(msg);
    } else {
      const msg = "All AI engines (Gemini, Groq, Mistral) are currently unavailable. Please try again later.";
      if (!isSpeakingRef.current) speak(msg);
      setAiText(msg);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true });
      toast.success("Logged out successfully!");
      setUserData(null);
      navigate('/login');
    } catch (err) {
      setUserData(null);
      toast.error(err.response?.data?.message || "Logout failed. Please try again!");
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
    utterance.lang = 'en-IN'; // Set language to English
    const voices = sythesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang === 'en-IN' || voice.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText(""); // Clear AI response text to show "Listening..."
      setUserText("");
      isProcessingRef.current = false; // Ensure processing flag is reset
      setIsProcessing(false); // Ensure processing state is reset
      // Restart recognition so the assistant starts listening for the next question
      if (recognitionRef.current && !isRecognizingRef.current && !isProcessingRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Speech Recognition Restart Error:", error);
          }
        }
      }
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
      recognition.lang = 'en-IN'; // Set language to English for better wake word detection, but it can understand English commands as well
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
        if (isMounted && !isSpeakingRef.current && !isProcessingRef.current && !isRecognizingRef.current) {
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
        if (isMounted && !isSpeakingRef.current && !isProcessingRef.current) {
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
          // BLOCK: If limit is hit and user hasn't paid, don't hit the backend
          if (aiErrorOccurred && !userData.user.isPremium) {
            const msg = "Question limit reached. Please use the Upgrade button to continue our conversation.";
            if (!isSpeakingRef.current) speak(msg);
            setAiText(msg);
            return;
          }

          console.log("Wake word detected! Calling Gemini...");
          try {
            setAiText("")
            setUserText(transcript)
            recognition.abort(); // Use abort for immediate stop when wake word is detected
            isRecognizingRef.current = false;
            setListening(false);
            isProcessingRef.current = true;
            setIsProcessing(true);
            const data = await askAssistant(transcript, preferredModelRef.current);

            console.log("Gemini Response:", 'data:', data);

            if (data.success) {
              if (data.user) {
                setUserData({ ...userData, user: data.user });
              }
              handleCommand(data);
              setIsProcessing(false);
              isProcessingRef.current = false;
              setAiText(data.response);
              setUserText("");
              // NEW: Update preferredModel if it was changed by the backend
              if (data.preferredModel && data.preferredModel !== preferredModelRef.current) {
                setPreferredModel(data.preferredModel);
              }
              setAiErrorOccurred(false); // Reset AI error flag on successful response
            }
            else {
              setIsProcessing(false);
              isProcessingRef.current = false;

              // If it's a limit or premium error, trigger the failure handler UI
              if (data.message.includes("limit") || data.message.includes("premium") || data.message.includes("exhausted")) {
                handleModelFailure({ response: { data: { message: data.message } } });
              } else if (!userData?.user?.isPremium) {
                // For any other AI error for non-premium users, also show the button
                setAiErrorOccurred(true);
              } else {
                speak(data.message || "Sorry, I couldn't process that.");
                setAiText(data.message || "Sorry, I couldn't process that.");
              }
              setUserText("");
            }

          } catch (error) {
            isProcessingRef.current = false;
            setIsProcessing(false);
            handleModelFailure(error); // Pass the error object
            setUserText("");
          }
        }
      };

      console.log(`Assistant ${userData.user.assistantName} is listening...`);

      if (!hasGreetedRef.current) {
        const greeting = new SpeechSynthesisUtterance(`Hello! How can I assist you today? Feel free and ask me anything about college.`);
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
    <div className='w-full relative overflow-x-hidden flex justify-center items-center flex-col min-h-screen bg-cover opacity-100 px-4'  style={{ backgroundImage: `url(${backgroundImage})` }} >
      <CgMenuRight className={`lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-20`} onClick={() => setToggleMenu(true)} />
      <div className={`absolute top-0 left-0 w-full h-full bg-[#575770bd] backdrop-blur-md p-[30px] flex flex-col gap-6 item-start ${toggleMenu ? "translate-x-0" : "translate-x-full"} transition-transform lg:hidden z-50`}>
        <RxCross2 className='cursor-pointer  lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px]' onClick={() => setToggleMenu(false)} />
        <button onClick={handleLogout} className='w-full max-w-[300px] mx-auto text-white px-5 py-3 rounded-full shadow-lg font-semibold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2'>
         Logout <FiLogOut size={16} /> 
        </button>
         <button onClick={()=>navigate("/admin")} className='w-full max-w-[300px] mx-auto text-white px-5 py-3 rounded-full shadow-lg font-semibold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2'>
         Admin <ShieldUser size={16} /> 
        </button>
      
        <hr className='w-full  border-gray-400' />

        <h1 className='text-white font-semibold text-[19px] underline flex items-center gap-2'>
          <MdHistory size={22} /> History
        </h1>


        <div className='w-full max-w-2xl flex-1 overflow-y-auto flex flex-col gap-3 '>
          {userData?.user?.history && userData.user.history.length > 0 ? (
            userData?.user?.history?.map((his, index) => (
              <div key={index} className='text-white text-[15px] border-b border-white/10 pb-1 flex items-center justify-between'>
                <span > {index + 1}. {his}</span>
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

      <div className='absolute hidden lg:flex items-center justify-between w-[95%] top-1 z-40'>
        <div className='flex ml-4 cursor-pointer'>
          <img src={headerlogo} alt="header-logo" className='h-30 object-contain hover:scale-110 transition-transform duration-300' />
        </div>
        <div className='flex items-center gap-4'>
        <button onClick={() => navigate('/history')} className='min-w-[130px] text-white px-6 py-2.5 rounded-full shadow-lg font-bold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2'>
         History <MdHistory size={18} /> 
        </button>
     
        <button onClick={() => navigate('/admin')} className='min-w-[130px] text-white px-6 py-2.5 rounded-full shadow-lg font-bold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2'>
          Admin <ShieldUser size={16} />
        </button>
        <button onClick={handleLogout} className='min-w-[130px] text-white px-6 py-2.5 rounded-full shadow-lg font-bold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2'>
          Logout <FiLogOut size={16} />
        </button>
        </div>
      </div>

  
  

      <div className=' text-center'>
        <h1 className='text-gray-50 text-xl lg:text-4xl font-bold '
            style={{ fontFamily: '"Poppins", sans-serif' }}>
          Smart College <span className='text-cyan-400 lg:text-5xl font-bold'>AI Assistant</span>
        </h1>
        <p className='text-gray-300 font-normal mt-2  text-[13px] md:text-[14px] '>Your voice. Your campus. An AI assistant that's always listening and always ready.</p>
      </div>
      <div className='relative flex flex-col md:flex-row justify-center items-center mt-15 w-full max-w-7xl gap-6 md:gap-16 lg:gap-32 px-4'>
        {/* Left Instruction Div */}
        <div className='hidden md:flex flex-col items-center justify-center text-center  '>
          <p 
            className='text-gray-200 text-xl'
            style={{ fontFamily: '"Monotype Corsiva", "Apple Chancery", cursive' }}
          >
            <span className='text-[#e88c2a] text-[39px] font-bold italic mr-1'>Hey,</span> Ask anything........ about college <br/>
            <span className='text-gray-200  '>Say hi to your assistant  <span className='text-[#f88102] text-3xl font-bold'>  {userData?.user?.assistantName}!</span></span>
          </p>
        </div>

        <div className='relative flex justify-center items-center'> 
        {/* Spinning AI Rings */}
        <div className='absolute w-[205px] h-[205px] lg:w-[245px] lg:h-[245px] rounded-full border-2 border-transparent border-t-gray-300 border-b-gray-300 animate-spin' style={{ animationDuration: '4s' }}></div>
        <div className='absolute w-[195px] h-[195px] lg:w-[230px] lg:h-[230px] rounded-full border-2 border-transparent border-l-gray-300 border-r-gray-300 animate-spin opacity-60' style={{ animationDirection: 'reverse', animationDuration: '2.5s' }}></div>

        {/* Assistant Image Container */}
        <div className='w-[180px] h-[180px] lg:w-[210px] lg:h-[210px] rounded-full overflow-hidden shadow-2xl border-4 border-white/10 z-10 bg-black/20'>
          <img src={sditslogo} alt="assistant" className='h-full w-full object-fit' />
        </div>
        </div>

        {/* Right Instruction Div */}
        <div className='hidden md:flex flex-col items-center justify-center text-center '>
          <p 
            className='text-gray-200 text-xl leading-tight'
            style={{ fontFamily: '"Monotype Corsiva", "Apple Chancery", cursive' }}
          >
            To get started, Say
            <span className='text-[#f88102] font-bold  text-4xl tracking-wide ' > {userData?.user?.assistantName || "VEDA"} </span> <br/> Before asking your question.
          </p> 
        </div>
      </div>
      <h1 className='text-gray-200 text-[14px] py-9 text-center  '>
      No typing, No click, Just speak,..........
      </h1>

      <div className='flex flex-col items-center bg-transparent '>
        {!showPayButton && (listening || isProcessing) && !aiText && <img src={userImage} alt="listening" className='w-[150px] h-[120px] mix-blend-screen' />}
        {/* isprocessing is t rue then show processing text if aiText is present then show aiText if listening is true then show listening else show userText */}
        {
          aiText && !isProcessing && <img src={ai} alt="responding" className='w-[100px]  h-[120px] mix-blend-screen' />}
        <h1 className='text-gray-200 text-[13px] lg:text-[15px] font-medium text-center px-4 lg:px-15 py-1 '>
          {isProcessing && !showPayButton
            ? "Processing..."
            : aiText
              ? aiText
              : listening && !showPayButton
                ? "Listening..."
                : userText || null
          }
             {showPayButton && !userData?.user?.isPremium && (
          <button onClick={handleUpgradeAndSwitch} disabled={isPaying} className='min-w-[220px] text-white px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)] font-bold bg-gradient-to-r from-yellow-300 to-orange-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:scale-105 transition-all duration-200 cursor-pointer border border-white/30 flex items-center mx-auto justify-center gap-2'>
            {isPaying ? "Processing..." :"Buy Credits "}
          </button>
        )}
        </h1>
      </div>
      <Footer />
    </div>
  )
}


export default Home;
