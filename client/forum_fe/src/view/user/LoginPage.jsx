import SideButton from "../../component/SideButton";
import Footer from "../../component/Footer";
import Navbar from "../../component/Navbar";
import SideBanner from '../../assets/sidebanner.jpg'
import { Button } from "@mui/material";
import '../css/Login.css'
import SendIcon from '@mui/icons-material/Send';
import { Link } from "react-router";
import { useState } from "react";


import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../auth/AuthContext"; 

function Login(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/menu');
        } catch (err) {
            setError('Invalid email or password.');
            console.log(err)
        }
    };


    return(
        <>
        <SideButton/>
        <Navbar/>
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-[90%] md:w-[80%] max-w-4xl mx-auto my-[5%]">
                <div className="grid grid-cols-1 md:grid-cols-2 ">
                    <div className="flex justify-end">
                        <img src={SideBanner} alt="side banner" id="side-banner"
                        className="w-full h-full object-cover max-h-[500px]"/>
                    </div>
                    <div className="bg-white flex flex-col items-center 
                    justify-center" id="side-form">
                        <div className="form w-[80%]">
                            <form action="" onSubmit={handleLogin}>
                                <p className="form-title">LOGIN</p>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <div className="w-full p-2">
                                    <input 
                                    placeholder="Enter your username"
                                    type="text" 
                                    className="w-full post-thread
                                    bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    id="" 
                                    onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="w-full p-2">
                                    <input 
                                    placeholder="Enter your password"
                                    type="password" 
                                    className="w-full post-thread
                                    bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    id="" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="w-full p-2">
                                    <Button 
                                    className="shadow-lg hover:shadow-2xl 
                                    transition-all duration-300"
                                    variant="contained" id="post-btn"
                                    startIcon={<SendIcon />}
                                    type="submit">
                                        LOGIN
                                    </Button>
                                </div>
                                <div className="w-full p-2 flex-col flex 
                                items-center" id="form-link">
                                    <Link to="/register">
                                        <p>Don't has an account? 
                                            <span className="text-[#9400D3]">
                                                Register here
                                            </span>!
                                        </p>
                                    </Link>
                                    <p>Did you forget your 
                                        <span className="text-[#9400D3]">
                                            password
                                        </span>?
                                    </p>
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

export default Login;

