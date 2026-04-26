import backgroundImage from '../assets/bg.jpeg'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from 'react-icons/io5';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate()
    const { serverUrl ,userData,setUserData} = useContext(userDataContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/auth/register`, {
                name, email, password
            }, { withCredentials: true }
            );
            console.log(result.data);
            if (result.data.success) {
                toast.success("Registration Successful");
                navigate('/login');
            }
        }
        catch (err) {
                        toast.error(err.response?.data?.message || "Registration failed.Please try again!")
            
            console.error("Registration Error:", err.response?.data?.message || "Registration failed. Please try again.");
            // setUserData(null); // No need to set to null if it was never set to begin with
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }
    return (
       <div className='w-full min-h-screen bg-cover flex justify-center items-center py-8' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <form onSubmit={handleSubmit} className=' p-10 w-[90%] md:w-[80%] max-w-[430px] h-auto min-h-[450px] bg-[#4b529569] backdrop-blur-md shadow-lg m-3 shadow-blue flex flex-col items-center gap-6 rounded-3xl'>
                <h1 className='text-white text-[20px] md:text-[25px] mb-6 font-semibold'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
                {/* Enter your name */}
                <input className=' w-full h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type="text" placeholder='Enter your  Name ......' value={name} onChange={(e) => setName(e.target.value)} required />
                {/* Enter your email */}

                <input className='w-full  h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type="email" placeholder='Enter your  Email ......' value={email} onChange={(e) => setEmail(e.target.value)} required />

                <div className=' w-full h-[50px] border border-gray-200 bg-transparent text-white rounded-full text-20 relative '>
                    <input className='w-full h-[50px] outline-none border border-gray-200 bg-transparent text-white placeholder:gray-300 px-[20px] py-[5px] rounded-full' type={showPassword ? "text" : "password"} placeholder='Enter your  Password ......' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {!showPassword &&
                        <IoEye className='absolute w-10 h-4 right-[20px] top-[20px] text-white cursor-pointer' onClick={() => setShowPassword(true)} />}
                    {showPassword &&
                        <IoEyeOff className='absolute w-10 h-4 right-[20px] top-[20px] text-white cursor-pointer' onClick={() => setShowPassword(false)} />}
                </div>
{error.length>0 && <span className='text-red-500 text-sm'>{error}</span>}

                <button type="submit" className='w-full cursor-pointer  h-[50px] text-white font-semibold  rounded-full text-[19px] outline-none border border-gray-200 bg-transparent' disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                    </button>
                <p className='text-white text-[14px] '>Already have an account? <Link to='/login'><span className='text-blue-400 cursor-pointer text-xl font-semibold'>Login</span></Link></p>

            </form>
        </div>
    )
}

export default Register
