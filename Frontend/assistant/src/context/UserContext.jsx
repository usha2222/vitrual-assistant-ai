import axios from 'axios';
import{ createContext, useEffect, useState } from 'react'
export const userDataContext = createContext();
const UserContext = ({ children }) => {
  // const serverUrl='http://localhost:5000';
  const serverUrl = 'https://clg-ai-assistant.onrender.com/api';
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
  useEffect(() => {
    handleCurrentUser();
  }, []);
 
  // console.log(serverUrl);
  const value = {
    serverUrl,
    userData,
    setUserData,
    frontEndImage,
    setFrontEndImage,
    backEndImage,
    setBackEndImage,
    seletectedImage,
    setSelectedImage
  }
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
