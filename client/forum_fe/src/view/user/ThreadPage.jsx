import SideButton from "../../component/SideButton";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { Link } from "react-router";
import { Button,IconButton  } from "@mui/material";
// import {Card, CardActionArea} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import '../css/Thread.css'
//images
import thread01 from '../../assets/thread01.png'
import thread02 from '../../assets/thread02.jpg'

function Thread(){
    return(
        <>
        <SideButton targetId="reply-box"/>
        <Navbar/>
        <div className="min-h-screen">
            <section className="flex flex-col items-center">
                <div className="w-[80%] pb-15">
                    {/* navigator */}
                    <div className="flex py-2 pb-4 gap-4 navigator-indicator">
                        <Link to="/">
                            <Button 
                            variant="contained"
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300" id="navigator-btn"
                            >
                                Category
                            </Button>
                        </Link>
                        <i className="bi bi-chevron-double-right"></i>
                        <Link to="/">
                            <Button 
                            variant="contained"
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300" id="navigator-btn"
                            >
                                category name
                            </Button>
                        </Link>                   
                    </div>

                    {/* reply column */}
                    <div className="flex flex-col gap-2 pb-20">

                        {/* thread card      */}
                        <div className="card p-4 rounded-md">

                            {/* thread title */}
                            <div className="thread-title">
                                <p>1.4 Wuling Megabase Factory Setup Blueprint with Max Production and no waste (Asia/NA/EU)</p>
                            </div>

                            {/* thread info */}
                            <div className="gap-2 thread-info flex justify-start items-center">
                                {/* indexing */}
                                <div className="index-box gap-2 flex">
                                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                                    <p>1</p>
                                </div>
                                <p>Just tuyen - 26/07/2026 (Fri) 19:20:24</p>
                                 {/* thread action */}
                                <div className="flex gap-2 p-2">
                                    <div className="flex flex-row items-center">
                                        <IconButton color="secondary" aria-label="add an alarm">
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                        <p>(12 likes)</p>
                                    </div>
                                    <Button variant="outlined" id="report-btn">
                                        Error
                                    </Button>
                                </div>
                            </div>


                            <div className="thread-context">
                                <p className="mt-2 mb-8">
                                    Anyone got tips on how to reach this point? I'm stuck on a build from 1.1. 
                                    Should I first explore and do the story or just copy and paste this build
                                    and hope for it to work?
                                </p>
                                <div className="thread-img grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    <img src={thread01} alt="" id="thread-imgs"/>
                                    <img src={thread02} alt="" id="thread-imgs"/>
                                    <img src={thread01} alt="" id="thread-imgs"/>
                                    <img src={thread02} alt="" id="thread-imgs"/>
                                    <img src={thread01} alt="" id="thread-imgs"/>
                                </div>
                            </div>
                        </div>
                        {/* reply card      */}
                        <div className="card p-4 rounded-md">
                            {/* thread info */}
                            <div className="gap-2 thread-info flex justify-start items-center">
                                {/* indexing */}
                                <div className="index-box gap-2 flex">
                                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                                    <p>1</p>
                                </div>
                                <p>Just tuyen - 26/07/2026 (Fri) 19:20:24</p>
                                 {/* thread action */}
                                <div className="flex gap-2 p-2">
                                    <div className="flex flex-row items-center">
                                        <IconButton color="secondary" aria-label="add an alarm">
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                        <p>(12 likes)</p>
                                    </div>
                                    <Button variant="outlined" id="report-btn">
                                        Error
                                    </Button>
                                </div>
                            </div>
                            <div className="thread-context">
                                <p className="mt-2 mb-8">
                                    A bit late to the party, but I love how Senjin-chan's attribute is fire—it's just so fitting.  
                                    Probably ties into the blacksmithing fire motif too, but at the same time, it feels like such a blatant intent to kill and hostility toward fertility, which is so often symbolized by plants and vegetation.  
                                    Fire's the ultimate strike against plants, after all.  
                                    Plus, grudges and revenge tend to get linked with fire in all sorts of ways, so maybe that's part of it too?
                                    A bit late to the party, but I love how Senjin-chan's attribute is fire—it's just so fitting.  
                                    Probably ties into the blacksmithing fire motif too, but at the same time, it feels like such a blatant intent to kill and hostility toward fertility, which is so often symbolized by plants and vegetation.  
                                    Fire's the ultimate strike against plants, after all.  
                                    Plus, grudges and revenge tend to get linked with fire in all sorts of ways, so maybe that's part of it too?
                                    A bit late to the party, but I love how Senjin-chan's attribute is fire—it's just so fitting.  
                                    Probably ties into the blacksmithing fire motif too, but at the same time, it feels like such a blatant intent to kill and hostility toward fertility, which is so often symbolized by plants and vegetation.  
                                    Fire's the ultimate strike against plants, after all.  
                                    Plus, grudges and revenge tend to get linked with fire in all sorts of ways, so maybe that's part of it too?
                                </p>
                            </div>
                        
                        </div>
                           
                    </div>

                    <div className="pb-10">
                        <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                           <i class="bi bi-pencil-square" id="head-icon"></i>
                            <p id='header-text'>WRITE A REPLY</p>
                        </div>

    
                        {/* thread post board */}
                        <div className="grid grid-cols-1">
                            <div id="reply-box">
                                <div className="py-4">
                                    {/* name */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                        <div className="w-full md:w-24 post-label flex-shrink-0">
                                            <p className="font-bold text-left md:text-right text-[#9400D3]">
                                            Name:
                                            </p>
                                        </div>
                                        <div className="w-full flex-1">
                                            <select name="" id="" 
                                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                                            focus:outline-none focus:ring-2 
                                            border text-[#9400D3] border-[#9400D3]">
                                                <option value="default" selected>Anonymous</option>
                                                <option value="default">User name</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                   {/* context */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                        <div className="w-full md:w-24 post-label flex-shrink-0">
                                            <p className="font-bold text-left md:text-right text-[#9400D3]">
                                            Content:
                                            </p>
                                        </div>
                                        <div className="w-full flex-1">
                                            <textarea name="" id="" placeholder="Enter your thread context"
                                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                                            focus:outline-none focus:ring-2 
                                            border text-[#9400D3] border-[#9400D3]"></textarea>
                                        </div>
                                    </div>

                                    {/* file */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                        <div className="w-full md:w-24 post-label flex-shrink-0">
                                            <p className="font-bold text-left md:text-right text-[#9400D3]">
                                            Images:
                                            </p>
                                        </div>
                                        <div className="w-full flex-1">
                                            <input placeholder="Enter thread title"
                                            type="file" className="w-full post-thread bg-white rounded-md px-3 py-2 
                                            focus:outline-none focus:ring-2 
                                            border text-[#9400D3] border-[#9400D3]" 
                                            id="" />
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end">
                                        <Button 
                                        className="shadow-lg
                                        hover:shadow-2xl transition-all duration-300"
                                        variant="contained" id="post-btn"
                                        startIcon={<SendIcon />}>
                                            Post Reply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <Footer/>
        </>
    )
}

export default Thread;