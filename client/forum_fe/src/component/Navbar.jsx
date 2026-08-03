import React from "react";
import icon from '../assets/icon.png'
import '../component/Navbar.css'
function Navbar(){
    return(
        <nav className="bg-[#9400D3] p-2 text-[16px]">
            <div className="flex justify-between">
                <img src={icon} alt="web icon" />
                <div className="flex gap-2 items-center">
                    <span className="text-white"
                    >Welcome back, dear!</span>
                    <div className="flex">
                        <input type="text" className="bg-white rounded-md p-2"
                        placeholder="search..." name="" id="" />
                        <button className="p-2 px-3 border border-white rounded-md" >
                            <i className="bi bi-search text-white"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="justify-evenly flex p-2">
                <div className="nav-items">
                    <p>Terms of service</p>
                </div>
                <div className="nav-items">
                    <p>Inquiry</p>
                </div>
                <div className="nav-items">
                    <p>About us</p>
                </div>
                <div className="nav-items">
                    <p>Category</p>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;