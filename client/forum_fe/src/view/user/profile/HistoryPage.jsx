import SideButton from "../../../component/SideButton"
import Navbar from "../../../component/Navbar"
import { Link } from "react-router"
import { Button } from "@mui/material"
import '../../css/Profile.css'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import { useState } from "react"

function Bookmarks(){
    return(
        <>
        </>
    )
}

function Likes(){
    return(
        <>
        </>
    )
}
function History(){
    const [activeTab, setActiveTab] = useState('overview');
    const renderSubView = () => {
        switch(activeTab){
            case 'like':
                return <Likes/>;
            case 'bookmark':
                return <Bookmarks/>
            
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
                        <Link to="/">
                            <Button 
                            variant="contained"
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300" id="navigator-btn"
                            >
                                History
                            </Button>
                        </Link>                   
                    </div>
                    {/* content */}
                    <div className="">
                        <div className="grid grid-cols-6 gap-4">
                            <div className="side-menu">
                                <ul>
                                    <Link to="/profile">
                                        <li className="flex gap-4 menus">
                                            <i class="bi bi-house-door-fill"></i>
                                            <p>Profile</p>
                                        </li>
                                    </Link>
                                    <Link to="/search">
                                        <li className="flex gap-4 menus">
                                            <i class="bi bi-search"></i>
                                            <p>Search</p>
                                        </li>
                                    </Link>
                                    <Link to="/rank">
                                        <li className="flex gap-4 menus">
                                            <i class="bi bi-bookmark-star-fill"></i>
                                            <p>Rank</p>
                                        </li>
                                    </Link>
                                    <Link to="/history">
                                        <li className="flex gap-4 menus">
                                            <CollectionsBookmarkIcon/>
                                            <p>History</p>
                                        </li>
                                    </Link>
                                    <Link to="/setting">
                                        <li className="flex gap-4 menus">
                                            <i class="bi bi-gear-fill"></i>
                                            <p>Setting</p>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                            <div className="col-span-5 side-section">
                                <div className="nav-bar flex gap-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setActiveTab('like')}
                                            className={`px-3.5 py-1.5 text-base font-bold rounded-full border border-[#9400D3] transition-all duration-300 capitalize ${
                                                activeTab === 'like'
                                                ? 'bg-[#9400D3] text-white shadow-md'
                                                : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                            }`}
                                            >
                                            Like Thread
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('bookmark')}
                                            className={`px-3.5 py-1.5 text-base font-bold rounded-full border border-[#9400D3] transition-all duration-300 capitalize ${
                                                activeTab === 'bookmark'
                                                ? 'bg-[#9400D3] text-white shadow-md'
                                                : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                            }`}
                                            >
                                            Bookmark Thread
                                        </button>                                        
                                    </div>
                                </div>
                                 {/* router-link content */}
                                <div className="min-h-[60vh]">
                                    {renderSubView()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
        </>
    )   
}

export default History