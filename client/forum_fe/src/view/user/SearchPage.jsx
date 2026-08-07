import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import '../css/Search.css'
import forumThumbnail from '../../assets/profileDefault.jpg'
import {Card,CardActionArea } from '@mui/material'
import { Button } from "@mui/material";
import { Link } from "react-router";
import SendIcon from '@mui/icons-material/Send';
import SideButton from "../../component/SideButton";
function Search(){
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
                                Search
                            </Button>
                        </Link>
                        <i className="bi bi-chevron-double-right"></i>
                        <Link to="/">
                            <Button 
                            variant="contained"
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300" id="navigator-btn"
                            >
                                keyword
                            </Button>
                        </Link>                   
                    </div>

                    {/* keyword */}
                    <div className="p-2 search-box">
                        <p>Search results for 
                            <span className="font-bold mx-2">"keyword"</span>: 1 to 4 of 4 results</p>
                    </div>

                    {/* card section */}
                    <div className="pb-20">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                            <Card>
                                <CardActionArea>
                                    <div className="grid grid-cols-3">
                                        <div class="p-2">
                                            <img src={forumThumbnail} alt="thread thubmail" 
                                            className="shadow-sm rounded-md"/>
                                        </div>
                                        <div class="col-span-2 p-2">
                                            <div className="card-title">
                                                <p>forum title</p>
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                {/* archive to display status */}
                                                <div className="card-info info-archive">
                                                    archived
                                                </div>
                                                {/* display the amount of reply */}
                                                <div className="card-info info-reply gap-1">
                                                    <i class="bi bi-chat-dots"></i>
                                                    view
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardActionArea>
                            </Card>
                        </div>
                    </div>

                    {/* post a thread */}
                    <div id="reply-box">
                        <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                           <i class="bi bi-pencil-square" id="head-icon"></i>
                            <p id='header-text'>WRITE A THREAD</p>
                        </div>

                        {/* rule board */}
                        <div class="py-2">
                            <div className="card bg-white w-[100%] p-2 border-[#9400D3] border-1 rounded-md">
                                <p className="font-bold">Note: Thread when post can not be changed</p>
                                <ul className="px-5">
                                    <ol>1. rule 1</ol>
                                    <ol>1. rule 2</ol>
                                    <ol>1. rule 3</ol>
                                    <ol>1. rule 4</ol>
                                    <ol>1. rule 5</ol>
                                </ul>
                                <div className="flex gap-2 items-center">
                                    <i class="bi bi-caret-right-fill"></i>
                                    <p>
                                        <span className="text-red-600">Remember:</span> rule breaker will face account suspension or user will be  banned 
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* thread post board */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            {/* pointing system */}
                            <div className="col-span-1">
                               <div className="bg-[#DE80E9] rounded-md shadow-md p-2">
                                    <div className="flex justify-center gap-2 underline text-white">
                                        <i class="bi bi-star-fill"></i>
                                        <p className="font-medium">Pointing System</p>
                                        <i class="bi bi-star-fill"></i>
                                    </div>
                                    <div className="p-2 text-white">
                                        <ul>
                                            <ol>
                                                1. 
                                            </ol>
                                            <ol>
                                                2. 
                                            </ol>
                                            <ol>
                                                3. 
                                            </ol>
                                            <ol>
                                                4. 
                                            </ol>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-2 rounded-md text-center">
                                        <p>
                                            Completion for the most popular thread to win some of<span className="text-red-600"> out reward!</span>
                                        </p>
                                    </div>
                               </div>
                            </div>

                            <div className="col-span-3">
                                {/* title */}
                                <div className="p-2">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                        {/* Label: Takes auto width on mobile, fixed width on desktop */}
                                        <div className="w-full md:w-24 post-label flex-shrink-0">
                                            <p className="font-bold text-left md:text-right text-[#9400D3]">
                                            Title:
                                            </p>
                                        </div>

                                        {/* Input: Takes remaining width automatically on desktop */}
                                        <div className="w-full flex-1">
                                            <input 
                                            placeholder="Enter thread title"
                                            type="text" 
                                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                                            focus:outline-none focus:ring-2 
                                            border text-[#9400D3] border-[#9400D3]" 
                                            id="" 
                                            />
                                        </div>
                                    </div>

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

                                    {/* category */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                        <div className="w-full md:w-24 post-label flex-shrink-0">
                                            <p className="font-bold text-left md:text-right text-[#9400D3]">
                                            Category:
                                            </p>
                                        </div>
                                        <div className="w-full flex-1">
                                            <select name="" id="" className="w-full post-thread bg-white rounded-md px-3 py-2 
                                            focus:outline-none focus:ring-2 
                                            border text-[#9400D3] border-[#9400D3]">
                                                <option value="default" selected>Pick a category</option>
                                                <option value="default">Category 1</option>
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
                                        className="shadow-lg hover:shadow-2xl transition-all duration-300"
                                        variant="contained" id="post-btn"
                                        startIcon={<SendIcon />}>
                                            Post Thread
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
export default Search;