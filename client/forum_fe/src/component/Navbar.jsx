import icon from '../assets/icon.png'
import '../component/Navbar.css'
import { Link } from 'react-router';
function Navbar(){
    return(
       <>
        {/* <CssBaseline/> */}
        <nav className="bg-[#9400D3] p-2 text-[16px]">
            <div className="flex justify-between">
                <Link to="/">
                    <img src={icon} alt="web icon" id="web-icon"/>
                </Link>
                <div className="flex gap-4 items-center w-[50%] justify-end">
                    <Link to="/login">
                        <span className="text-white welcome-text text-shadow-lg">
                            Welcome back, dear!
                        </span>
                    </Link>
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