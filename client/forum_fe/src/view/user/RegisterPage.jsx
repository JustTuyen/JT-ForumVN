import SideButton from "../../component/SideButton";
import Footer from "../../component/Footer";
import Navbar from "../../component/Navbar";
import SideBanner from '../../assets/sidebanner.jpg'
import { Button } from "@mui/material";
import '../css/Login.css'
import SendIcon from '@mui/icons-material/Send';
import { Link } from "react-router";
function Register(){

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
                            <form action="">
                                <p className="form-title">REGISTER</p>
                                <div className="w-full p-2">
                                    <input 
                                    placeholder="Enter your username"
                                    type="text" 
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
                                    type="password" 
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
                                    className="w-full post-thread
                                    bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    id="" 
                                    />
                                </div>
                                <div className="w-full p-2">
                                    <Button 
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

