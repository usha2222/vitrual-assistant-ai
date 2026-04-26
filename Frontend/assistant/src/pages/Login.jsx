import React from 'react'
import backgroundImage from '../assets/bg.jpeg'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from 'react-icons/io5';
import { useState, useContext } from 'react';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { serverUrl, userData, setUserData } = useContext(userDataContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${serverUrl}/auth/login`, {
                email, password
            }, { withCredentials: true });
            console.log(response.data);
            setUserData(response.data);
            toast.success("Login successful!");
            navigate("/");

        } catch (err) {
            console.error("Login Error:", err);
            toast.error(err.response?.data?.message || "Login failed.Please try again!")
            setUserData(null);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full relative overflow-hidden min-h-screen bg-cover flex justify-center items-center py-8' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <form onSubmit={handleSubmit} className=' p-7 w-[90%] md:w-[80%] max-w-[430px] h-auto min-h-[420px] bg-[#4b529569] backdrop-blur-md shadow-lg m-3 shadow-blue flex flex-col items-center gap-6 rounded-3xl'>
                <h1 className='text-white text-[20px] md:text-[25px] mb-6 font-semibold'>Login to <span className='text-blue-500'>Virtual Assistant</span></h1>

                {/* Enter your email */}
                <input className='w-full  h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type="email" placeholder='Enter your  Email ......' value={email} onChange={(e) => setEmail(e.target.value)} required />

                <div className=' w-full h-[50px] border border-gray-200 bg-transparent text-white rounded-full text-20 relative '>
                    <input className='w-full h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type={showPassword ? "text" : "password"} placeholder='Enter your  Password ......' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {!showPassword &&
                        <IoEye className='absolute w-10 h-4 right-[20px] top-[20px] text-white cursor-pointer' onClick={() => setShowPassword(true)} />}
                    {showPassword &&
                        <IoEyeOff className='absolute w-10 h-4 right-[20px] top-[20px] text-white cursor-pointer' onClick={() => setShowPassword(false)} />}
                </div>
                {error.length > 0 && <span className='text-red-500 text-sm font-medium'>{error}</span>}

                <button type="submit" className='w-full  h-[50px] cursor-pointer text-white font-semibold  rounded-full text-[19px] outline-none border border-gray-200 bg-transparent' disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p className='text-white text-[14px] '>Want to Create  an account? <Link to='/register'><span className='text-blue-500 cursor-pointer text-xl font-semibold'>Register</span></Link></p>
            </form>
        </div>
    )
}

export default Login
