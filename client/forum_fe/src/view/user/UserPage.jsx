import { Button } from "@mui/material";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import SideButton from "../../component/SideButton";
import { Link } from "react-router";
import Profile01 from '../../assets/profile01.png'
import { useState } from "react";
import forumThumbnail from '../../assets/profileDefault.jpg'
import {Card, CardActionArea} from "@mui/material";
import '../css/User.css'

function ThreadOverView(){
    return(
        <>
        <div className="min-h-[60vh]">
            <div className="flex justify-end gap-2 sorting">
                <p>Sorting Threads:</p>
                <select name="" id="">
                    <option value="">A-z</option>
                    <option value="">New</option>
                    <option value="">Archived</option>
                    <option value="">Most view</option>
                    <option value="">Most Like</option>
                </select>
            </div>
            <div className="pb-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                    <Card>
                        <CardActionArea>
                            <div className="grid grid-cols-3">
                                <div class="p-2">
                                    <img src={forumThumbnail} 
                                    alt="thread thubmail" 
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
        </div>
        </>
    )
}

function Bookmarks(){
    return(
        <>
        <div className="min-h-[60vh]">
            <div className="flex justify-end gap-2 sorting">
                <p>Sorting Bookmarks:</p>
                <select name="" id="">
                    <option value="">A-z</option>
                    <option value="">New</option>
                    <option value="">Archived</option>
                    <option value="">Most view</option>
                    <option value="">Most Like</option>
                </select>
            </div>
            <div className="pb-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                    <Card>
                        <CardActionArea>
                            <div className="grid grid-cols-3">
                                <div class="p-2">
                                    <img src={forumThumbnail} 
                                    alt="thread thumbnail" 
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
        </div>
        </>
    )
}

function User(){
const [activeTab, setActiveTab] = useState('overview');
const renderSubView = () => {
    switch(activeTab){
        case 'thread-overview':
            return <ThreadOverView/>;
        case 'bookmarks':
            return <Bookmarks/>;
    }
};
    return(
        <>
        <SideButton/>
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
                                Home
                            </Button>
                        </Link>
                        <i className="bi bi-chevron-double-right"></i>
                        <Button 
                        variant="contained"
                        className="shadow-lg hover:shadow-2xl 
                        transition-all duration-300" id="navigator-btn"
                        >
                            Username#1
                        </Button>       
                    </div>

                    {/* user information */}
                    <div className="user-info flex flex-row gap-4 items-center">
                        <img src={Profile01} alt="user-profile" id="user-icon"/>
                        <div className="flex flex-col gap-2">
                            {/* username and threads */}
                            <div className="flex flex-row gap-4 items-center">
                                <p className="user-name">User name</p>
                                <p className="user-thread">Owner of 20k thread</p>
                            </div>
                            <div className="text-[14px]">
                                <p className="user-context">|| Business Email: roriipupperoffical@gmail.com YT: http://youtube.com/c/Roriipupper Support: http://patreon.com/Roriipupper More info in extended bio.</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <i class="bi bi-calendar-check-fill text-[#9400D3]"></i>
                                <p>Joined since 11/11/2026</p>
                            </div>
                        </div>
                    </div>

                    {/* thread and bookmarks     */}
                    <div className="">
                        <div className="py-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                            <button
                                onClick={() => setActiveTab('thread-overview')}
                                className={`px-3.5 py-1.5 text-[16px] font-medium rounded-md 
                                    border border-[#9400D3] transition-all duration-300 
                                    capitalize ${
                                    activeTab === 'thread-overview'
                                    ? 'bg-[#9400D3] text-white shadow-md'
                                    : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                }`}
                                >
                                Threads
                            </button>
                            <button
                                onClick={() => setActiveTab('bookmarks')}
                                className={`px-3.5 py-1.5 text-[16px] font-medium rounded-md 
                                    border border-[#9400D3] transition-all duration-300 
                                    capitalize ${
                                    activeTab === 'bookmarks'
                                    ? 'bg-[#9400D3] text-white shadow-md'
                                    : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                }`}
                                >
                                Bookmarks
                            </button>
                        </div>
                        {/* routerlink content */}
                        <div className="min-h-[60vh]">
                            {renderSubView()}
                        </div>
                    </div>

                </div>
            </section>
        </div>
        <Footer/>
        </>
    )
}

export default User;