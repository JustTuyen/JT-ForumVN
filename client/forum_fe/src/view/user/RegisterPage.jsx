import SideButton from "../../component/SideButton";
import Footer from "../../component/Footer";
import Navbar from "../../component/Navbar";
import SideBanner from '../../assets/sidebanner.jpg'
import { Button } from "@mui/material";
import '../css/Login.css'
import SendIcon from '@mui/icons-material/Send';
import { Link, useNavigate } from "react-router";
import {toast, ToastContainer} from 'react-toastify';
import { useState } from "react";
import api from "../../auth/ApiHandle";
function Register(){
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [passwordCheck, setPasswordcheck] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if(password !== passwordCheck){
            toast.error('password is mismatch!',
                {
                    position: 'top-right',
                    autoClose: 3000,
                }
            )

            return
        }

        try {
            await api.post('/api/users/',{
                username: username,
                password: password,
                email: email
            })

            toast.success('register successfully!',{
                position: 'top-right',
                autoClose: 1000,
            })

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            const message = err.response?.data?.username?.[0]
                || err.response?.data?.email?.[0]
                || err.response?.data?.password?.[0]
                || err.response?.data?.detail
                || 'Registration failed. Please try again.';

            toast.error(message, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };


    return(
        <>
        <ToastContainer/>
        <SideButton/>
        <Navbar/>
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-[90%] md:w-[80%] max-w-4xl mx-auto my-[5%]">
                <div className="grid grid-cols-1 md:grid-cols-2 ">
                    <div className="flex justify-end">
                        <img src={SideBanner} alt="side banner" id="side-banner"
                        className="w-full h-full object-cover max-h-125"/>
                    </div>
                    <div className="bg-white flex flex-col items-center 
                    justify-center" id="side-form">
                        <div className="form w-[80%]">
                            <form action="" onSubmit={handleRegister}>
                                <p className="form-title">REGISTER</p>
                                <div className="w-full p-2">
                                    <input 
                                    placeholder="Enter your username"
                                    type="text" 
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full post-thread
                                    bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    id="" 
                                    />
                                </div>
                                <div className="w-full p-2">
                                    <input 
                                    placeholder="Enter your email"
                                    type="text" 
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full post-thread
                                    bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    id="" 
                                    />
                                </div>
                                <div className="w-full p-2">
                                    <input 
                                    placeholder="Enter your password"
                                    type="password" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full post-thread
                                    bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    id="" 
                                    />
                                </div>
                                <div className="w-full p-2">
                                    <input 
                                    placeholder="Enter your password again"
                                    type="password" 
                                    onChange={(e) => setPasswordcheck(e.target.value)}
                                    className="w-full post-thread
                                    bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    id="" 
                                    />
                                </div>
                                <div className="w-full p-2">
                                    <Button type="submit"
                                    className="shadow-lg hover:shadow-2xl 
                                    transition-all duration-300"
                                    variant="contained" id="post-btn"
                                    startIcon={<SendIcon />}>
                                        REGISTER
                                    </Button>
                                </div>
                                <div className="w-full p-2 flex-col flex 
                                items-center" id="form-link">
                                    <Link to="/login">
                                        <p>Already has an account? 
                                            <span className="text-[#9400D3]">
                                                Login here
                                            </span>!
                                        </p>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Register;

