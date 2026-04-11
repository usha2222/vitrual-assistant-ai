import React from 'react'
import backgroundImage from '../assets/background.jpeg'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from 'react-icons/io5';
import { useState, useContext } from 'react';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';

import { Link, useNavigate } from 'react-router-dom';
const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate();
    const {serverUrl}=useContext(userDataContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${serverUrl}/api/auth/login`, {
                email, password
            }, { withCredentials: true });
            console.log(response.data);
            setLoading(false);

            if (response.data.success) {
                alert('Logged in successfully!');
                navigate('/');
            }
        } catch (err) {
            // toast.error("Login falied")
            alert('Login failed. Please check your credentials and try again.');
            console.error("Login Error:", err);
            setLoading(false);
            setError(err.response?.data?.message || "Login failed. Please try again."); 
        }
    }

    return (
        <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <form onSubmit={handleSubmit} className=' p-10 w-[80%] max-w-[430px] h-[450px]  bg-[#4f3e3e69] backdrop-blur-md shadow-lg m-3 shadow-blue flex flex-col items-center  gap-6 rounded-3xl'>
                <h1 className='text-white text-[25px] mb-6 font-semibold'>Login to <span className='text-blue-400'>Virtual Assistant</span></h1>

                {/* Enter your email */}
                <input className='w-full  h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type="email" placeholder='Enter your  Email ......' value={email} onChange={(e) => setEmail(e.target.value)} required />

                <div className=' w-full h-[50px] border border-gray-200 bg-transparent text-white rounded-full text-20 relative '>
                    <input className='w-full h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type={showPassword ? "text" : "password"} placeholder='Enter your  Password ......' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {!showPassword &&
                        <IoEye className='absolute w-10 h-4 right-[20px] top-[20px] text-white cursor-pointer' onClick={() => setShowPassword(true)} />}
                    {showPassword &&
                        <IoEyeOff className='absolute w-10 h-4 right-[20px] top-[20px] text-white cursor-pointer' onClick={() => setShowPassword(false)} />}
                </div>
{error.length>0 && <span className='text-red-800 '>{error}</span>}

                <button type="submit" className='w-full  h-[50px] text-white font-semibold  rounded-full text-[19px] outline-none border border-gray-200 bg-transparent' disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p className='text-white text-[14px] '>Want to Create have an account? <Link to='/register'><span className='text-blue-400 cursor-pointer text-xl font-semibold'>Register</span></Link></p>
            </form>
        </div>
    )
}

export default Login
