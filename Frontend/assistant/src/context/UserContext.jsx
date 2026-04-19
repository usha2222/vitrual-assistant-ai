import axios from 'axios';
import{ createContext, useEffect, useState } from 'react'
export const userDataContext = createContext();
const UserContext = ({ children }) => {
  // const serverUrl='http://localhost:5000';
  const serverUrl = 'https://vitrual-assistant-ai.onrender.com';
  const [userData, setUserData] = useState(null);
  const [frontEndImage, setFrontEndImage] =useState(null);
  const [seletectedImage, setSelectedImage] = useState(null);
      const [backEndImage, setBackEndImage] = useState(null);
  const handleCurrentUser =async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      setUserData(result.data);
      // console.log("Current User Data:", result.data);
    }
    catch (err) {
      console.error("Error setting user data:", err);
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
