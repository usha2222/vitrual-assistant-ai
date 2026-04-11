import React, { createContext } from 'react'
export const userDataContext=createContext();
const UserContext = ({children}) => {
    const serverUrl = 'http://localhost:5000';
    console.log(serverUrl);
    const value={
        serverUrl
    }
  return (
    <userDataContext.Provider value={value}>
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext
