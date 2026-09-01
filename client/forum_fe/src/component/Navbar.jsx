import icon from '../assets/icon.png'
import '../component/Navbar.css'
import { Link, useNavigate } from 'react-router';

import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';

function Navbar(){
    const { user,logout } = useAuth();
    const [keyword, setKeyword] = useState('')
    const navigator = useNavigate()

    const handleSearch = (e) =>{
        e.preventDefault()
        if (!keyword.trim()) return;
        navigator(`/search?q=${encodeURIComponent(keyword)}`)
    }

    return(
       <>
        {/* <CssBaseline/> */}
        <nav className="bg-[#9400D3] p-2 text-[16px]">
            <div className="flex justify-between">
                <Link to="/">
                    <img src={icon} alt="web icon" id="web-icon"/>
                </Link>
                <div className="flex gap-4 items-center w-[50%] justify-end">
                    {/* <Link to="/profile">
                        <p className="text-white welcome-text text-shadow-lg">
                            Welcome back, 
                            <span className='mx-2'>{user?.username ?? 'Guest'}!</span>
                        </p><button onClick={logout}>Log Out</button>
                    </Link> */}
                    {user ? (
                        <div className="d-flex align-items-center gap-3">
                            {/* Profile Link */}
                            <Link to="/profile" className="text-white welcome-text text-shadow-lg">
                                Welcome back, <span className="mx-2">{user.username}!</span>
                            </Link>
                            {/* Log Out Button (Keep OUTSIDE the Link tag) */}
                            <button onClick={logout} className="btn btn-outline-light logout-btn">
                                Log Out
                            </button>
                        </div>
                            ) : (
                            /* v-else condition */
                        <Link to="/login" className="btn btn-primary text-white">
                            Log In
                        </Link>
                    )}

                    <div className="flex">
                        <form action="" className='flex-row' onSubmit={handleSearch}>
                            <input type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="search..." className="search-input rounded-l-lg"/>
                            <button className="search-btn rounded-r-lg" type='submit'>
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="justify-evenly flex p-1">
                <div className="nav-items">
                    <Link to="/about">About us</Link>
                </div>
                <div className="nav-items">
                    <Link to="/inquiry">Inquiry</Link>
                </div>
                <div className="nav-items">
                    <Link to="/services">Terms of service</Link>
                </div>
                <div className="nav-items">
                    <Link to="/menu">Category</Link>
                </div>
            </div>
        </nav>
    </>
    )
}

export default Navbar;