import React from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
const Card = ({image}) => {
      const  {frontEndImage,setFrontEndImage,backEndImage,setBackEndImage,seletectedImage,setSelectedImage} = useContext(userDataContext);
  return (

    <div className={`w-[180px]  h-[250px]  rounded-2xl overflow-hidden shadow shadow-olive-400 hover:shadow-md hover:scale-105 hover:border-white ${seletectedImage==image ?"border-2 border-white shadow-2xl shadow-gray-100":null}`} onClick={()=>{setSelectedImage(image)
      setBackEndImage(null);
      setFrontEndImage(null);
          }}>
      <img src={image} alt="Assistant" className='w-full h-full object-cover rounded-2xl'/>
    </div>
  )
}

export default Card
