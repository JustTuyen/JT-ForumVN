import SideButton from "../../../component/SideButton"
import Navbar from "../../../component/Navbar"
import { Link, useNavigate } from "react-router"
import { Button } from "@mui/material"
import '../../css/Profile.css'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import {toast} from 'react-toastify'
import api from "../../../auth/ApiHandle"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {formatDate} from './style/Modals'


function History(){
    const [reports, setReport] = useState([])
    const {user} = useAuth()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    if(!user){
        toast.warning("you must login to use this page!",{
            position: 'top-right',
            autoClose: 3000,
        })
        
        setTimeout(() => {
            navigate('/login');
        }, 1500);

    }

    const [selectValue, setSelectValue] = useState('-created_at');
    const [ordering, setOrdering] = useState('-created_at');
    const [statusSelectValue, setStatusSelectValue] = useState('all');

    const fetchReport = useCallback(async (
        sortParam = ordering, 
        statusParam = statusSelectValue
    )=>{

        try{
            const params = new URLSearchParams()
            if(statusParam && statusParam !== 'all'){
                params.append('status', statusParam)
            }

            params.append('ordering', sortParam)
            const {data} = await api.get(`/api/reports/my_report/?${params.toString()}`)
            setReport(data.result ?? data)
        } catch (err){
            console.error('Error fetching threads:', err);
            const msg = err.response?.data?.detail || 'Failed to fetch threads.';
            toast.error(msg, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally{
            setLoading(false)
        }
    }, [ordering, statusSelectValue])

    useEffect(()=>{
        if (!user) {
            toast.error('You must login to use this function!');
            navigate('/login');
        } else {
            fetchReport();
        }
    },[user, fetchReport, navigate])
    
    const handleStatusSelectChange = (newStatus) => {
        setStatusSelectValue(newStatus);
        fetchReport(ordering, newStatus);
    };
    
    const handleSortChange = (newSort) => {
        setOrdering(newSort);
        fetchReport(newSort, statusSelectValue);
    };

    const handleSelectChange=(value)=>{
        setSelectValue(value)
        if(value.startsWith('status:')){
            const statusId = value.split(':')[1]
            setStatusSelectValue(statusId)
        } else {
            handleSortChange(value)
        }
    }

   


    if (loading) return(
        <>
        <div className="min-h-screen flex flex-col justify-center items-center">
            <Box sx={{ display: 'flex' }}>
                <CircularProgress aria-label="Loading…" />
            </Box>
        </div>
        </>
    );

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
                                <div className="flex justify-between gap-2">
                                    <p className="form-title">Report Manager:</p>
                                    <div className="sorting gap-2 flex">
                                        sorting:
                                   <select value={selectValue} onChange={(e) => handleSelectChange(e.target.value)}>
                                        <option value="-title">A-Z</option>
                                        <option value="-created_at">New</option>
                                        <option value="-view_count">Most Viewed</option>
                                        <option value="-like_count">Most Liked</option>
                                    </select>
                                    <select value={statusSelectValue} onChange={(e) => handleStatusSelectChange(e.target.value)}>
                                        <option value="all">All Statuses</option>
                                        <option value="1">On going</option>
                                        <option value="2">Archived</option>
                                        <option value="3">Report</option>
                                    </select>
                                    </div>
                                </div>
                                 {/* router-link content */}
                                <div className="min-h-[60vh]">
                                {reports.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                    {reports.map((report) =>(
                                        <div className="card shadow-md">
                                            <div className="">
                                                <p>
                                                    You report this <span className="text-[#9400D3] font-bold">
                                                    {report.content_type_name}</span> on {formatDate(report.created_at)}
                                                </p>
                                                <p>Type of violation: {report.violation_type}</p>
                                                <p>Reason: {report.reason}</p>
                                                <p>status: {report.status_name}</p>
                                            </div>
                                        </div>

                                    ))}
                                    </div>         
                                ):(
                                    <div className="bg-white p-4
                                    flex justify-center rounded-md shadow-md">
                                        <p className="text-[#9400D3] font-bold">You haven't post any thread yet!</p>
                                    </div>
                                )}

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