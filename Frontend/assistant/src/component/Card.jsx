import React from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const Card = ({image}) => {
      const  {frontEndImage,setFrontEndImage,backEndImage,setBackEndImage,seletectedImage,setSelectedImage} = useContext(userDataContext);
  return (

    <div className={`w-[45%] min-w-[120px] h-[160px] sm:w-[150px] sm:h-[200px] md:w-[180px] md:h-[250px] rounded-2xl overflow-hidden shadow shadow-olive-400 hover:scale-105 transition-all duration-300 cursor-pointer ${seletectedImage==image ?"border-2 border-gray-200 shadow shadow-gray-400 scale-105":"border-2 border-transparent"}`} onClick={()=>{setSelectedImage(image)
      setBackEndImage(null);
      setFrontEndImage(null);
      toast.success("Assistant image selected!");
          }}>
      <img src={image} alt="Assistant" className='w-full h-full object-cover rounded-2xl'/>
    </div>
  )
}

export default Card
