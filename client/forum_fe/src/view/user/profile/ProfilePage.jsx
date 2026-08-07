import SideButton from "../../../component/SideButton"
import Footer from "../../../component/Footer"
import Navbar from "../../../component/Navbar"
import { Link } from "react-router"
import { Button } from "@mui/material"
import '../../css/Profile.css'
import { useState } from "react"
import SendIcon from '@mui/icons-material/Send';

import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
//images
import defaultImg from '../../../assets/profileDefault.jpg'


//account checking section
function ProfileOverview(){
    return(
        <>
        <div className="py-2 min-h-[60vh]">
            <div className="flex flex-row justify-between items-end changed-info">
                <div className="bg-[#D8BFD8] border-[#9400D3] rounded-md border p-2">
                    <p className="">Hello, username#1, your account info last update is 18/02/2026</p>
                </div>
                <div className="flex flex-col items-center badge-tab">
                    <WorkspacePremiumIcon/>
                    <p>101</p>
                </div>
            </div>

            <div className="p-4">
                {/* Username */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                    <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] flex-shrink-0">
                        Username:
                    </label>
                    <div className="w-full flex-1">
                        <input 
                            id="username"
                            type="text" 
                            disabled
                            placeholder="UserName"
                            className="w-full bg-white rounded-md px-3 py-2 border 
                            text-[#9400D3] border-[#9400D3]" 
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                    <label htmlFor="email" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] flex-shrink-0">
                        Email:
                    </label>
                    <div className="w-full flex-1">
                        <input 
                            id="email"
                            type="email" 
                            disabled
                            placeholder="email@example.com"
                            className="w-full bg-white rounded-md px-3 py-2 border 
                            text-[#9400D3] border-[#9400D3]" 
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 py-1">
                    <label htmlFor="description" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] flex-shrink-0 md:pt-2">
                        Description:
                    </label>
                    <div className="w-full flex-1">
                        <textarea 
                            id="description"
                            rows={3}
                            disabled
                            placeholder="User description"
                            className="w-full bg-white rounded-md px-3 py-2 border 
                            text-[#9400D3] border-[#9400D3]" 
                        />
                    </div>
                </div>

                {/* Gender & Birthday Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-1">
                    {/* Gender */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <label htmlFor="gender" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] flex-shrink-0">
                            Gender:
                            </label>
                        <input 
                            id="gender"
                            type="text" 
                            disabled
                            placeholder="User gender"
                            className="w-full bg-white rounded-md px-3 py-2 border 
                            text-[#9400D3] border-[#9400D3] " 
                        />
                    </div>

                    {/* Birthday */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <label htmlFor="birthday" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] flex-shrink-0">
                            Birthday:
                        </label>
                        <input 
                        id="birthday"
                        type="date" 
                        disabled
                        className="w-full bg-white rounded-md px-3 py-2 border 
                            text-[#9400D3] border-[#9400D3]" 
                    />
                    </div>
                </div>
                
                <div className="flex flex-col pt-4
                md:flex-row justify-end gap-2
                md:gap-4 py-1">
                    <Button variant="outlined" className="shadow-md" id='profile-btn-1'>
                        Update profile
                    </Button>
                    <Button variant="outlined" className="shadow-md" id='profile-btn-2'>
                        Update profile
                    </Button>
                </div>

            </div>
        </div>
        </>
    )
}

//thread checking section
function ThreadOverview(){
    return(
        <>
        <div className="py-2 min-h-[60vh]">
            <div className="flex justify-end gap-2 sorting">
                <p>Sorting:</p>
                <select name="" id="">
                    <option value="">A-z</option>
                    <option value="">New</option>
                    <option value="">Archived</option>
                    <option value="">Most view</option>
                    <option value="">Most Like</option>
                </select>
            </div>

            <div className="py-2">
                <div className="grid grid-cols-1 gap-4">
                    <div className="card shadow-md">
                        <div className="flex flex-row gap-2">
                            <img src={defaultImg} alt="" id='thread-thumbnail'/>
                            <div className="thread-title">
                                <p>Arknights Endfield might be getting heat with IS , rouge like and somthing, something </p>
                            </div>
                            
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2
                         justify-between">
                             <div className="flex gap-2 items-end">
                                <p className="date-info">
                                    <span className="text-[#9400D3] font-bold">created:</span> 22/02/2026 
                                    -
                                    <span className="text-[#9400D3] font-bold">created:</span> 22/02/2026
                                </p>
                                <div className="flex gap-2">
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
                            <div className="flex flex-row justify-end p-2 gap-2">
                                <Button variant="outlined" className="shadow-md" id='thread-btn-1'>
                                    View
                                </Button>
                                <Button variant="delete" className="shadow-md" id='thread-btn-2'>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

//bookmark section
function BookMarks(){
    return(
        <>
        <div className="py-2 min-h-[60vh]">
            <div className="flex justify-end gap-2 sorting">
                <p>Sorting:</p>
                <select name="" id="">
                    <option value="">A-z</option>
                    <option value="">New</option>
                    <option value="">Archived</option>
                    <option value="">Most view</option>
                    <option value="">Most Like</option>
                </select>
            </div>

            <div className="py-2">
                <div className="grid grid-cols-1 gap-4">
                    <div className="card shadow-md">
                        <div className="flex flex-row gap-2">
                            <img src={defaultImg} alt="" id='thread-thumbnail'/>
                            <div className="thread-title">
                                <p>Arknights Endfield might be getting heat with IS , rouge like and somthing, something </p>
                            </div>
                            
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2
                         justify-between">
                             <div className="flex gap-2 items-end">
                                <p className="date-info">
                                    <span className="text-[#9400D3] font-bold">created:</span> 22/02/2026 
                                    -
                                    <span className="text-[#9400D3] font-bold">created:</span> 22/02/2026
                                </p>
                                <div className="flex gap-2">
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
                            <div className="flex flex-row justify-end p-2 gap-2">
                                <Button variant="outlined" className="shadow-md" id='thread-btn-1'>
                                    View
                                </Button>
                                <Button variant="delete" className="shadow-md" id='thread-btn-2'>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

function Posting(){
    return(
        <>
         <div className="py-2 min-h-[60vh]">
            <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                <i class="bi bi-pencil-square" id="head-icon"></i>
                <p id='header-text'>WRITE A THREAD</p>
            </div>

            {/* rule board */}
            <div class="py-2">
                <div className="card-rule bg-white p-2 border-[#9400D3] border-1 rounded-md">
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
        </>
    )
}

function Profile(){
    const [activeTab, setActiveTab] = useState('overview');
    const renderSubView = () => {
        switch(activeTab){
            case 'overview':
                return <ProfileOverview/>;
            case 'thread-overview':
                return <ThreadOverview/>;
            case 'bookmark':
                return <BookMarks/>
            case 'posting':
                return <Posting/>
        }
    };

    return(
        <>
        <SideButton/>
        <Navbar/>
        <div className="min-h-screen">
            <section className="flex flex-col items-center">
                <div className="w-[80%]">
                    {/* navigator */}
                    <div className="flex py-2 pb-4 gap-4 navigator-indicator">
                        <Link to="/">
                            <Button 
                            variant="contained"
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300" id="navigator-btn"
                            >
                                Home
                            </Button>
                        </Link>
                        <i className="bi bi-chevron-double-right"></i>
                        <Link to="/profile">
                            <Button 
                            variant="contained"
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300" id="navigator-btn"
                            >
                                Profile
                            </Button>
                        </Link>                   
                    </div>
                    <div>
                        <div class="grid grid-cols-6 gap-4">
                            <div className="side-menu">
                                <ul>
                                    <li className="flex gap-4">
                                        <i class="bi bi-house-door-fill"></i>
                                        <p>Profile</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <i class="bi bi-search"></i>
                                        <p>Search</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <i class="bi bi-bookmark-star-fill"></i>
                                        <p>Rank</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <i class="bi bi-gear-fill"></i>
                                        <p>Setting</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-span-5 side-section">
                                {/* routerlink section */}
                                <div className="nav-bar flex gap-2">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Button id='nav-items'
                                            onClick={() => setActiveTab('overview')}
                                           className={`${
                                            activeTab === 'overview'
                                                ? 'bg-[#9400D3] text-white shadow-md'
                                                : 'text-gray-600 hover:bg-gray-200/60'
                                            }`}
                                        >Your </Button>
                                        <Button variant="outlined" id='nav-items'
                                        onClick={() => setActiveTab('thread-overview')}>
                                            Your Thread
                                        </Button>
                                        <Button variant="outlined" id='nav-items'
                                        onClick={() => setActiveTab('bookmark')}>
                                            Your Bookmark
                                        </Button>
                                        <Button variant="outlined" id='nav-post'
                                        onClick={() => setActiveTab('posting')}>
                                            Post
                                        </Button>
                                    </div>
                                </div>

                                {/* routerlink content */}
                                <div className="min-h-[60vh]">
                                    {renderSubView()}
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

export default Profile