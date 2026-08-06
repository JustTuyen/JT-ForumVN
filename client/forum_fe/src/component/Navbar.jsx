// import React from "react";
import icon from '../assets/icon.png'
import '../component/Navbar.css'
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
function Navbar(){
    return(
       <>
        {/* <CssBaseline/> */}
        <nav className="bg-[#9400D3] p-2 text-[16px]">
            <div className="flex justify-between">
                <img src={icon} alt="web icon" id="web-icon"/>
                <div className="flex gap-4 items-center w-[50%] justify-end">
                    <span className="text-white welcome-text text-shadow-lg"
                    >Welcome back, dear!</span>
                    <div className="flex">
                        <input type="text"
                        placeholder="search..." className="search-input rounded-l-lg"/>
                        <button className="search-btn rounded-r-lg">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="justify-evenly flex p-1">
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
    </>
    )
}

export default Navbar;