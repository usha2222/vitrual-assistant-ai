import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react'
export const userDataContext = createContext();
const UserContext = ({ children }) => {
  const serverUrl='http://localhost:5000/api';
  // const serverUrl = 'https://clg-ai-assistant.onrender.com/api';
  const [userData, setUserData] = useState(null);
  const [frontEndImage, setFrontEndImage] =useState(null);
  const [seletectedImage, setSelectedImage] = useState(null);
      const [backEndImage, setBackEndImage] = useState(null);
  const handleCurrentUser =async () => {
    try {
      const result = await axios.get(`${serverUrl}/user/current`, { withCredentials: true });
      setUserData(result.data.user ? result.data : null);
      // console.log("Current User Data:", result.data);
    }
    catch (err) {
      setUserData(null);
    }
  }
  const deleteHistory=async(index)=>{
    try {
      const result = await axios.post(`${serverUrl}/user/delete-history`, { index }, { withCredentials: true });
      console.log("History deleted:", result.data);
      setUserData(result.data);
    }
    catch(err){
console.log(err)
    }
  }
  const getGeminiResponse = useCallback(async (command) => {
    try{
      const result = await axios.post(`${serverUrl}/user/asktoassistant`,{command},{ withCredentials: true }); 
      console.log("Gemini Response:", result.data);
      return result.data; // Ensure we return the data payload
    }
    catch (error) {
      console.error("Gemini Response Error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.response || "Failed to connect to assistant";
      return { success: false, message: errorMsg };
    }
  }, [serverUrl]);
  
  useEffect(() => {
    handleCurrentUser();

  }, []);
 
 
  const value = {
    serverUrl,
    userData,
    setUserData,
    frontEndImage,
    setFrontEndImage,
    backEndImage,
    setBackEndImage,
    seletectedImage,
    setSelectedImage,
    getGeminiResponse,
    deleteHistory
  }
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
