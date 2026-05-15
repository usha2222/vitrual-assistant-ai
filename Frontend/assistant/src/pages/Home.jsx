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
import { MdOutlineCreditScore } from "react-icons/md";

const Home = () => {

  const { userData, setUserData, serverUrl, askAssistant, } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isProcessingRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const sythesis = window.speechSynthesis;
  const isSpeakingRef = useRef(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);
  const hasGreetedRef = useRef(false);
  const [preferredModel, setPreferredModel] = useState("Gemini");
  const [showPayButton, setShowPayButton] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Fix closure bug: Speech recognition needs to know the current model without restarting the effect
  const preferredModelRef = useRef(preferredModel);
  useEffect(() => {
    preferredModelRef.current = preferredModel;
  }, [preferredModel]);


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
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
    // Show button if not premium and they have used at least one question (or always if preferred)
    if (userData && !userData.user.isPremium && userData.user.history.length >= 20) {
      setShowPayButton(true);
    } else {
      setShowPayButton(false);
    }
  }, [userData]);

  const handleModelFailure = (error) => {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
    if (!userData?.user?.isPremium) {
      setShowPayButton(true);
      const msg = errorMessage.includes("limit") ? errorMessage : `${preferredModel} is currently overloaded. Please Buy Credits to switch engines.`;
      if (!isSpeakingRef.current) speak(msg); // Only speak if not already speaking
      setAiText(msg);
    } else {
      // Premium cycling logic: Gemini -> Groq -> Mistral
      let current = preferredModel;
      let next = "";
      if (preferredModel === "Gemini") {
        next = "Groq";
      } else if (preferredModel === "Groq") {
        next = "Mistral";
      } else {
        next = "Gemini";
      }

      const switchMsg = `${current} is not responding. Switching to ${next}...`;
      toast.info(switchMsg);
      if (!isSpeakingRef.current) speak(switchMsg);
      setAiText(switchMsg);
      setPreferredModel(next);
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
    utterance.lang = 'en-US'; // Set language to English
    const voices = sythesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang.startsWith('en'));
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
      if (recognitionRef.current && !isRecognizingRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error("Speech Recognition Restart Error:", error);
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
        if (isMounted && !isSpeakingRef.current && !isProcessingRef.current) {
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
          console.log("Wake word detected! Calling Gemini...");
          try {
            setAiText("")
            setUserText(transcript)
            recognition.stop(); // Stop recognition while processing the command
            isRecognizingRef.current = false;
            setListening(false);
            isProcessingRef.current = true;
            setIsProcessing(true);
            const data = await askAssistant(transcript, preferredModelRef.current);

            console.log("Gemini Response:", data);

            if (data.message === "Token not found" || data.success === false && data.message?.includes("Token")) {
              toast.error("Session expired. Please login again.");
              setUserData(null);
              isProcessingRef.current = false;
              setIsProcessing(false);
              navigate('/login');
              return;
            }

            if (data.success) {
              if (data.user) {
                setUserData({ ...userData, user: data.user });
              }
              handleCommand(data);
              setIsProcessing(false);
              isProcessingRef.current = false;
              setAiText(data.response);
              setUserText("");
            }
            else {
              setIsProcessing(false);
              isProcessingRef.current = false;

              // If it's a limit or premium error, trigger the failure handler UI
              if (data.message.includes("limit") || data.message.includes("premium")) {
                handleModelFailure({ response: { data: { message: data.message } } });
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
    <div className='w-full relative overflow-x-hidden flex justify-center items-center flex-col min-h-screen bg-gradient-to-t from-[#38383c] py-8 to-[#5351e1]  px-4'>
      <CgMenuRight className={`lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-20`} onClick={() => setToggleMenu(true)} />
      <div className={`absolute top-0 left-0 w-full h-full bg-[#575770bd] backdrop-blur-md p-[30px] flex flex-col gap-6 item-start ${toggleMenu ? "translate-x-0" : "translate-x-full"} transition-transform lg:hidden z-50`}>
        <RxCross2 className='cursor-pointer  lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px]' onClick={() => setToggleMenu(false)} />
        <button onClick={handleLogout} className='w-full max-w-[300px] mx-auto text-white px-5 py-3 rounded-full shadow-lg font-semibold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2'>
         Logout <FiLogOut size={16} /> 
        </button>
        {showPayButton && !userData?.user?.isPremium && (
          <button onClick={handleUpgradeAndSwitch} disabled={isPaying} className='w-full max-w-[300px] mx-auto text-white px-5 py-3 rounded-full shadow-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 transition-all cursor-pointer mt-4 border border-white/30 flex items-center justify-center gap-2'>
            {isPaying ? "Processing..." : "✨ UPGRADE TO PREMIUM"}
          </button>
        )}
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

      <div className='absolute hidden lg:flex items-center gap-4 top-8 right-10 z-40'>
        <button onClick={() => navigate('/history')} className='min-w-[130px] text-white px-6 py-2.5 rounded-full shadow-lg font-bold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2'>
         History <MdHistory size={18} /> 
        </button>
        <button onClick={handleLogout} className='min-w-[130px] text-white px-6 py-2.5 rounded-full shadow-lg font-bold border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2'>
          Logout <FiLogOut size={16} />
        </button>
      </div>

      {showPayButton && !userData?.user?.isPremium && (
        <div className='fixed bottom-10 right-4 lg:right-10 z-[60]'>
            <button onClick={handleUpgradeAndSwitch} disabled={isPaying}  className='min-w-[220px] text-white px-8 py-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-white/30 flex items-center justify-center gap-2'>
               {isPaying ? "Processing..." : <><span className="animate-pulse text-xl">✨</span> UPGRADE TO PREMIUM</>}
            </button>
        </div>
      )}

      <div className=' text-center'>
        <h1 className='text-gray-50 text-xl lg:text-4xl font-bold'>Smart College <span className='text-cyan-400'>AI Assistant</span></h1>
        <p className='text-gray-300 mt-2 text-sm lg:text-base   '>An AI-based voice assistant for campus guidance and student support</p>
      </div>
      <div className='relative flex justify-center items-center mt-15'>
        {/* Spinning AI Rings */}
        <div className='absolute w-[205px] h-[205px] lg:w-[245px] lg:h-[245px] rounded-full border-2 border-transparent border-t-gray-300 border-b-gray-300 animate-spin' style={{ animationDuration: '4s' }}></div>
        <div className='absolute w-[195px] h-[195px] lg:w-[230px] lg:h-[230px] rounded-full border-2 border-transparent border-l-gray-300 border-r-gray-300 animate-spin opacity-60' style={{ animationDirection: 'reverse', animationDuration: '2.5s' }}></div>

        {/* Assistant Image Container */}
        <div className='w-[180px] h-[180px] lg:w-[210px] lg:h-[210px] rounded-full overflow-hidden shadow-2xl border-4 border-white/10 z-10 bg-black/20'>
          <img src={sditslogo} alt="assistant" className='h-full w-full object-fit' />
        </div>


      </div>
      <h1 className='text-gray-300 text-[14px] py-9 text-center font-semibold'>
        <span className='text-cyan-400 text-[18px] font-bold'>Meet {userData?.user?.assistantName}! </span>Ask me anything about college
      </h1>

      <div className='flex flex-col items-center bg-transparent '>
        {(listening || isProcessing) && !aiText && <img src={userImage} alt="listening" className='w-[150px] h-[120px] mix-blend-screen' />}
        {/* isprocessing is t rue then show processing text if aiText is present then show aiText if listening is true then show listening else show userText */}
        {
          aiText && !isProcessing && <img src={ai} alt="responding" className='w-[100px]  h-[120px] mix-blend-screen' />}
        <h1 className='text-gray-200 text-[13px] lg:text-[15px] font-medium text-center px-4 lg:px-15 py-1 '>
          {isProcessing
            ? "Processing..."
            : aiText
              ? aiText
              : listening
                ? "Listening..."
                : userText || null
          }
        </h1>
      </div>
      <div className='absolute top-2 right-100'>
      </div>
      <Footer />
    </div>
  )
}


export default Home;
