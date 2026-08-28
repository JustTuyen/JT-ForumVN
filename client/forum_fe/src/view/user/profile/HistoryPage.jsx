import SideButton from "../../../component/SideButton"
import Navbar from "../../../component/Navbar"
import { Link, useNavigate } from "react-router"
import { Button } from "@mui/material"
import '../../css/History.css'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import {toast, ToastContainer} from 'react-toastify'
import api from "../../../auth/ApiHandle"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {formatDate, modalStyle2} from './style/Modals'
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';


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

   
    const getStatusColor = (status) => {
    const statusName = typeof status === 'object' ? status?.name : status;

        switch (statusName?.toLowerCase()) {
            case 'approved':
            case 'completed':
                return 'success'; // Green

            case 'pending':
            case 'process':
                return 'warning'; // Orange/Yellow

            case 'rejected':
                return 'error';   // Red

            default:
                return 'default'; // Gray
        }
    };

    const [open, setOpen] = useState(false);
    const [selectedReportId, setSelectedThreadId] = useState(null);
    const openModal = (reportId) => {
        setSelectedThreadId(reportId);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setSelectedThreadId(null);
    };

    const handleConfirmUpdate = async () => {
        await patchReport(selectedReportId);
        closeModal();
    };

    const [reason, setReason] = useState('')
    const [violationType, setViolationType] = useState('')

    const patchReport = async (id) => {
        try {
            await api.patch(`/api/reports/${id}/`,{
                reason: reason,
                violation_type: violationType

            });
            toast.success('Report updated successfully!', {
                position: 'top-right',
                autoClose: 1000,
            });
        } catch (error) {
            toast.error(`${error}!`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const [open1, setOpen1] = useState(false);
    const openModal1 = (reportId) => {
        setSelectedThreadId(reportId);
        setOpen1(true);
    };
    const closeModal1 = () => {
        setOpen1(false);
        setSelectedThreadId(null);
    };

    const handleConfirmDelete = async () => {
        await deleteReport(selectedReportId);
        closeModal();
    };

    const deleteReport = async (id) => {
        try {
            await api.patch(`/api/reports/${id}/`,{
                "status": 19

            });
            toast.success('Report deleted successfully!', {
                position: 'top-right',
                autoClose: 1000,
            });
        } catch (error) {
            toast.error(`${error}!`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };


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
        <ToastContainer/>
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
                                <div className="grid-cols-1 grid md:grid-cols-2 gap-2">
                                    <p className="form-title">Report Manager:</p>
                                    <div className="sorting grid gap-2 grid-cols-2">
                                        <select value={selectValue} onChange={(e) => handleSelectChange(e.target.value)}>
                                            <option value="-created_at">New</option>
                                            <option value="-updated_at">Newly Updated</option>
                                            <option value="violation_type">Most Viewed</option>
                                            <option value="content_type">Most Liked</option>
                                        </select>
                                        <select value={statusSelectValue} onChange={(e) => handleStatusSelectChange(e.target.value)}>
                                            <option value="all">All Statuses</option>
                                            <option value="15">Pending</option>
                                            <option value="17">Completed</option>
                                            <option value="19">Aborted</option>
                                        </select>
                                    </div>
                                </div>
                                 {/* router-link content */}
                                <div className="min-h-[60vh] flex-col gap-2 flex pt-4">
                                    <div className="bg-[#D8BFD8] p-2 rounded-md border-[#9400D3] border">
                                        <p>You, this is the rule:</p>
                                        <ol>
                                            <li>Coffee</li>
                                            <li>Tea</li>
                                            <li>Milk</li>
                                        </ol> 
                                    </div>
                                {reports.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                    {reports.map((report, index) =>(
                                        <div className="card">
                                            <div className="card-data flex gap-2">                                               
                                                <p><span className="font-bold"># {index + 1} :</span>
                                                    You report this <span className="font-bold">
                                                    {report.content_type_name}</span> on {formatDate(report.created_at)}
                                                </p>
                                            </div>

                                            <div className="flex flex-col card-general p-2 gap-2">
                                                <p><span className="font-bold">Type of violation: </span>{report.violation_type}</p>
                                                <p>
                                                    <span className="font-bold">Your reason: </span>
                                                    {report.reason ?? 'None'}
                                                </p>
                                                <div>
                                                    <span className="font-bold">Status: </span> 
                                                    <Chip 
                                                        label={typeof report.status_name === 'object' ? 
                                                            report.status_name?.name : report.status_name} 
                                                        color={getStatusColor(report.status_name)} 
                                                        size="small" 
                                                        variant="outlined" 
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center border-t p-2">
                                                    <span className="font-bold">Action: </span> 
                                                    <div className="flex gap-2">
                                                        <Button variant="contained" color="secondary"
                                                        onClick={() => openModal(report.id)}>
                                                            Edit
                                                        </Button>
                                                       <Button variant="outlined" color="error"
                                                       onClick={() => openModal1(report.id)}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>                                       
                                        </div>
                                    ))}
                                    </div>         
                                ):(
                                    <div className="bg-white p-4
                                    flex justify-center rounded-md shadow-md">
                                        <p className="text-[#9400D3] font-bold">You don't has any report in this!</p>
                                    </div>
                                )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={closeModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={open}>
                <Box  sx={modalStyle2}>
                    <div className="flex justify-center
                    text-[24px] lg:text-[32px] text-[#9400D3] font-bold">
                        <p>Update Report</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <p>Are you sure you want to update this report?</p>
                            <select name="" id="" value={violationType}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2
                            border text-[#9400D3] border-[#9400D3]"
                            onChange={(e) => setViolationType(e.target.value)}>
                                <option value="Spam" selected>Spam</option>
                                <option value="Hate, Abuse, or Harassment">Hate, Abuse, or Harassment</option>
                                <option value="Impersonation" >Impersonation</option>
                                <option value="Child Safety">Child Safety</option>
                                <option value="Violent Speech" >Violent Speech</option>
                                <option value="Graphic or Violent Media">Graphic or Violent Media</option>
                                <option value="Illegal  and Regulated Behaviors" >Illegal  and Regulated Behaviors</option>
                                <option value="Hate, Abuse, or Harassment">Hate, Abuse, or Harassment</option>
                                <option value="Adult Sexual Content" >Adult Sexual Content</option>
                                <option value="Private or Non-Consensual Content" >Private or Non-Consensual Content</option>
                                <option value="Suicide or Self-Harm" >Suicide or Self-Harm</option>
                                <option value="Terrorism or Violent Extremism" >Terrorism or Violent Extremism</option>
                                <option value="Civic Integrity" >Civic Integrity</option>
                            </select>
                            <textarea name="" id=""
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            placeholder="Please a reason if you want">
                            </textarea>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmUpdate}>
                                Yes
                            </Button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open1}
            onClose={closeModal1}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={open1}>
                <Box  sx={modalStyle2}>
                    <div className="flex justify-center
                    text-[24px] lg:text-[32px] text-[#9400D3] font-bold">
                        <p>Abort Report</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <p>Are you sure you want to abort this report?</p>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmDelete}>
                                Yes
                            </Button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>


        
        </>
    )   
}

export default History