import React, { useContext, useRef, useState } from 'react'
import Card from '../component/Card'
import image7 from '../assets/image7.jpeg'
import image2 from '../assets/image2.png'
import image3 from '../assets/image3.jpeg'
import image4 from '../assets/image4.jpeg'
import image6 from '../assets/image6.jpeg'
import image8 from '../assets/image8.jpeg'
import { Link, useNavigate } from 'react-router-dom'
import { IoCloudUpload } from 'react-icons/io5'
import { userDataContext } from '../context/UserContext'
import { MdKeyboardArrowLeft, MdKeyboardBackspace } from 'react-icons/md'

const Customize = () => {
    const { frontEndImage, setFrontEndImage, backEndImage, setBackEndImage, seletectedImage, setSelectedImage } = useContext(userDataContext);
    const inputImage = useRef();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setBackEndImage(file);
        setFrontEndImage(URL.createObjectURL(file));
    };
    const navigate = useNavigate()
    return (
        <div className='w-full min-h-screen bg-gradient-to-t from-[#383737] py-8 to-[#0b08cb]   py-8 items-center to-[#4141c5] '>
            <button onClick={() => navigate('/')} className='absolute top-[30px] left-[30px]  text-white w-[40px] h-[40px]   cursor-pointer rounded-full  shadow    items-center flex justify-center shadow-gray-400 font-bold  '>
                <MdKeyboardBackspace size={20} />

            </button>
            <h1 className='text-white text-[25px] mb-6 font-semibold text-center pt-5'>Select Your <span className='text-blue-500'>Virtual Assistant Image</span></h1>
            <div className='w-[90%] max-w-[60%] flex justify-center items-center mx-auto gap-5 flex-wrap '>

                <Card image={image7} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image8} />
                <Card image={image6} />

                <div className={`w-[180px] h-[250px] border-2 border-gray-600 flex flex-col justify-center items-center rounded-2xl overflow-hidden text-white shadow shadow-olive-400 hover:shadow-md hover:scale-105 transition-transform duration-100 cursor-pointer relative  ${seletectedImage == "input" ? "border-2 border-white shadow-2xl shadow-gray-100" : null}`} onClick={
                    () => {
                        inputImage.current.click()
                        setSelectedImage("input")
                    }}>

                    {!frontEndImage && <IoCloudUpload size={50} className='text-white' />}

                    {frontEndImage && <img src={frontEndImage} alt="Selected" className='w-full h-full object-cover rounded-2xl' />}
                    <input type="file" accept="image/*" ref={inputImage} onChange={handleImageChange} className='hidden' />

                </div>



            </div>
            {seletectedImage && (
                <button type="submit" onClick={() => navigate("/customizename")} className=' w-50 cursor-pointer flex justify-center align-center items-center mx-auto my-8  h-[50px] text-black bg-white font-semibold  rounded-full text-[19px] outline-none border font-bold border-gray-200 bg-transparent' >Next</button>
            )}
        </div>

    )
}

export default Customize
