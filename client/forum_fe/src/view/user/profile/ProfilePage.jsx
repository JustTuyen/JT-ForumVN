/* eslint-disable react-hooks/set-state-in-effect */
import SideButton from "../../../component/SideButton"
import Footer from "../../../component/Footer"
import Navbar from "../../../component/Navbar"
import { Link, useNavigate } from "react-router"
import { Button } from "@mui/material"
import '../../css/Profile.css'
import { useCallback, useEffect, useState } from "react"
import SendIcon from '@mui/icons-material/Send';
//
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import DrawIcon from '@mui/icons-material/Draw';
import {ToastContainer, toast } from 'react-toastify'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
//images
import defaultImg from '../../../assets/profileDefault.jpg'
import { useAuth } from "../../../auth/AuthContext"
import api from "../../../auth/ApiHandle"
//
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {modalStyle, formatDate, modalStyle2} from './style/Modals'
//account checking section
function ProfileOverview(){

    const {user, loading} = useAuth()
    // if(!user){
    //     toast.warning("you must login to use this page!",{
    //         position: 'top-right',
    //         autoClose: 1500,
    //     })
        
    //     setTimeout(() => {
    //         navigate('/login');
    //     }, 3000);

    // }
   
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [open1, setOpen1] = React.useState(false);
    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);
    //
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')
    const [gender, setGender] = useState('')
    const [birthday, setBirthday] = useState('')

    //new psswrds
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')
    //
    useEffect(()=>{

    
        if(user){
            setEmail(user.email || '');
            setUsername(user.username || '');
            setDescription(user.description || '');
            setGender(user.gender || '');
            setBirthday(user.birth_date || '');
        }
    }, [user])

    const updateProfile = async(e) =>{
        e.preventDefault()
        if(!user) return

        const formData = new FormData()
        formData.append('email', email)
        formData.append('username', username)
        formData.append('description', description)
        formData.append('gender', gender)
        formData.append('birth_date', birthday)

        console.log("data: ", Array.from(formData.entries()));
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try{
            await api.patch(`/api/users/me/`, formData,{
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            toast.success('profile update successfully!', {
                position: 'top-right',
                autoClose: 1000,
            });

            setTimeout(() => {
                window.location.reload(); // Added () execution parentheses
            }, 1500);

        } catch (error) {
            toast.error(`${error}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    }

    const updatePassword = async(e) =>{
        e.preventDefault()
        if(!user) return
        
        if(newPassword!=checkPassword){
            toast.error('new password is mismatched!', {
                position: 'top-right',
                autoClose: 1000,
            });

            return
        }

        if(oldPassword!=newPassword){
            toast.error('old and new password cannot be the same!', {
                position: 'top-right',
                autoClose: 1000,
            });

            return
        }

        try{
            await api.patch(`/api/users/${user.id}/password/`,{
                old_password: oldPassword,
                password: newPassword
            }, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Updated password successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });

            setTimeout(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; 
            }, 4000);

        } catch(error){
             toast.error(`${error}!`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    } 
    if (loading) return <p>Loading...</p>;
    if (!user) return null; 


    return(
        <>
        <div className="py-2 min-h-[60vh]">
            <div className="flex flex-row justify-end items-end changed-info">
                {/* <div className="bg-[#D8BFD8] border-[#9400D3] rounded-md border p-2">
                    <p className="">
                        hello, {user?.username}. your last u
                    </p>
                </div> */}
                <div className="flex flex-col items-center badge-tab">
                    <WorkspacePremiumIcon/>
                    <p>{user?.current_point}</p>
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
                            disabled value={user.username}
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
                            disabled value={user.email}
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
                            disabled value={user.description}
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
                        <label htmlFor="gender" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                            Gender:
                            </label>
                        <input 
                            id="gender"
                            type="text" 
                            disabled value={user.gender}
                            placeholder="User gender"
                            className="w-full bg-white rounded-md px-3 py-2 border 
                            text-[#9400D3] border-[#9400D3] " 
                        />
                    </div>

                    {/* Birthday */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <label htmlFor="birthday" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                            Birthday:
                        </label>
                        <input 
                        id="birthday"
                        type="date" 
                        disabled value={user.birth_date}
                        className="w-full bg-white rounded-md px-3 py-2 border 
                            text-[#9400D3] border-[#9400D3]" 
                    />
                    </div>
                </div>
                
                <div className="flex flex-col pt-4
                md:flex-row justify-end gap-2
                md:gap-4 py-1">
                    <Button variant="outlined" className="shadow-md" id='profile-btn-1'
                    onClick={handleOpen}>Update profile
                    </Button>
                    
                    <Button variant="outlined" className="shadow-md" 
                    id='profile-btn-2'
                    onClick={handleOpen1}> 
                        Update password
                    </Button>
                </div>

            </div>
        </div>

        <div>
        <ToastContainer/>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={open}>
                <Box  sx={modalStyle}>
                    <div className="p-4 flex justify-center">
                        <p className="form-title">Update Profile</p>
                    </div>
                    <div className="bg-[#D8BFD8] border-[#9400D3] rounded-md border p-2">
                        <p className="">
                            hello, {user?.username}. your last updated was {user?.updated_at}
                        </p>
                    </div>
                    <form action="" className="p-4"  onSubmit={updateProfile}>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                            <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right 
                            text-[#9400D3] shrink-0">
                                Email:
                            </label>
                            <div className="w-full flex-1">
                                <input 
                                    type="text" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white rounded-md px-3 py-2 border 
                                    text-[#9400D3] border-[#9400D3]" 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                            <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                                Username:
                            </label>
                            <div className="w-full flex-1">
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white rounded-md px-3 py-2 border 
                                    text-[#9400D3] border-[#9400D3]" 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                            <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                                Description:
                            </label>
                            <div className="w-full flex-1">
                                <textarea 
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white rounded-md px-3 py-2 border 
                                text-[#9400D3] border-[#9400D3]" 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                            <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                                Gender:
                            </label>
                            <div className="w-full flex-1">
                                <select name="" id="" value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full bg-white rounded-md px-3 py-2 border 
                                text-[#9400D3] border-[#9400D3]">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                            <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                                Birthday:
                            </label>
                            <div className="w-full flex-1">
                               <input 
                                type="date" 
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                className="w-full bg-white rounded-md px-3 py-2 border 
                                text-[#9400D3] border-[#9400D3]" 
                                />
                            </div>
                        </div>
                        <div className="flex justify-end p-2">
                            <Button type="submit" id='update-btn'>
                                Update
                            </Button>
                        </div>
                    </form>
                </Box>
            </Fade>
        </Modal>
        </div>
        <div>
            <ToastContainer/>
            <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open1}
            onClose={handleClose1}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
                <Fade in={open1}>
                    <Box  sx={modalStyle}>
                        <div className="p-4 flex justify-center">
                            <p className="form-title">Update Password</p>
                        </div>
                        <div className="bg-[#D8BFD8] border-[#9400D3] rounded-md border p-2">
                            <p className="">
                                hello, {user?.username}. your last updated was {user?.updated_at}
                            </p>
                        </div>
                        
                        <form action="" className="p-4"  onSubmit={updatePassword}>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                                <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right 
                                text-[#9400D3] shrink-0">
                                    Current Password:
                                </label>
                                <div className="w-full flex-1">
                                    <input 
                                        type="password" 
                                        placeholder="Enter your old password"
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full bg-white rounded-md px-3 py-2 border 
                                        text-[#9400D3] border-[#9400D3]" 
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                                <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                                    New Password:
                                </label>
                                <div className="w-full flex-1">
                                    <input 
                                        type="password" 
                                        placeholder="Enter new password again"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white rounded-md px-3 py-2 border 
                                        text-[#9400D3] border-[#9400D3]" 
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-1">
                                <label htmlFor="username" className="w-full md:w-28 font-bold text-left md:text-right text-[#9400D3] shrink-0">
                                    Enter Again:
                                </label>
                                <div className="w-full flex-1">
                                    <input 
                                        type="password" 
                                        placeholder="Enter your new password"
                                        onChange={(e) => setCheckPassword(e.target.value)}
                                        className="w-full bg-white rounded-md px-3 py-2 border 
                                        text-[#9400D3] border-[#9400D3]" 
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end p-2">
                                <Button type="submit" id='update-btn'>
                                    Update
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div>
        </>
    )
}

//thread checking section
function ThreadOverview(){
    const navigate = useNavigate();
    const [threads, setThread] = useState([])
    const {user,loading} = useAuth()
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

    const fetchThread = useCallback(async (
        sortParam = ordering, 
        statusParam = statusSelectValue
    ) =>{
        try{
            const params = new URLSearchParams()
            if(statusParam && statusParam !== 'all'){
                params.append('status', statusParam)
            }
            params.append('ordering', sortParam)
            const {data} = await api.get(`/api/threads/my_threads/?${params.toString()}`)
            setThread(data.results ?? data)
            
        } catch (err) {
            console.error('Error fetching threads:', err);
            const msg = err.response?.data?.detail || 'Failed to fetch threads.';
            toast.error(msg, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    }, [ordering, statusSelectValue])

    useEffect(() => {
        if (!loading) {
            if (!user) {
                toast.error('You must login to use this function!');
                navigate('/login'); 
            } else {
                fetchThread(); 
            }
        }
    }, [user, loading, fetchThread, navigate]);

    

    const handleStatusSelectChange = (newStatus) => {
        setStatusSelectValue(newStatus);
        fetchThread(ordering, newStatus);
    };
    
    const handleSortChange = (newSort) => {
        setOrdering(newSort);
        fetchThread(newSort, statusSelectValue);
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

    //update thread

    const [open, setOpen] = React.useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState(null);

    const openModal = (threadId) => {
        setSelectedThreadId(threadId);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setSelectedThreadId(null);
    };

    const handleConfirmArchive = async () => {
        await archiveThread(selectedThreadId);
        closeModal();
    };

    const archiveThread = async (id) => {
        try {
            await api.patch(`/api/threads/${id}/archive/`);
            toast.success('Thread archived successfully!', {
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

    const [open1, setOpen1] = React.useState(false);
    const openModal1 = (threadId) => {
        setSelectedThreadId(threadId);
        setOpen1(true);
    };
    const closeModal1 = () => {
        setOpen1(false);
        setSelectedThreadId(null);
    };

    const handleConfirmDelete = async () => {
        await DeleteThread(selectedThreadId);
        closeModal();
    };

    const DeleteThread = async (id) => {
        try {
            await api.patch(`/api/threads/${id}/soft_delete/`);
            toast.success('Thread archived successfully!', {
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

    if (loading) return <p>Loading...</p>;

    return(
        <>
        <ToastContainer/>
        <div className="py-2 min-h-[60vh]">
            <div className="flex justify-end gap-2 sorting">
                <p>Sorting:</p>
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

            <div className="py-2">
                {threads.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {threads.map((thread) =>(                    
                    <div className="card shadow-md">
                        <div className="flex flex-row gap-4">
                            <img 
                            src={thread.images?.find((img)=>
                            img.is_thumbnail)?.file || defaultImg} 
                            alt={thread.images?.find((img)=>
                            img.alt_text) || "thumbnail"} 
                            className="shadow-sm rounded-md"
                            id='thread-thumbnail'
                            />
                            <div className="thread-title">
                                <p>{thread.title}</p>
                            </div>
                            
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2
                         justify-between">
                            <div className="flex gap-2 items-end p-2">
                                <p className="date-info">
                                    <span className="text-[#9400D3] font-bold">
                                        created: 
                                    </span> {formatDate(thread.created_at) }
                                    -
                                    <span className="text-[#9400D3] font-bold">
                                        updated: 
                                    </span>{formatDate(thread.updated_at) }
                                </p>
                                <div className="flex gap-2">
                                    <div className="card-info info-archive">
                                        {thread.status_name}
                                    </div>
                                    {/* display the amount of reply */}
                                    <div className="card-info info-reply gap-1">
                                        <i class="bi bi-chat-dots"></i>
                                        {thread.reply_count}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-end items-end gap-2">
                                <Link to={`/threads/${thread.id}`}>
                                    <Button variant="outlined" className="shadow-md" id='thread-btn-1'>
                                        View
                                    </Button>
                                </Link>
                                <Button className="shadow-md" id='thread-btn-3'
                                onClick={() => openModal(thread.id)}>
                                    Close
                                </Button>
                                <Button variant="delete" className="shadow-md" 
                                id='thread-btn-2'
                                onClick={() => openModal1(thread.id)}
                                >
                                    Delete
                                </Button>
                            </div>
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
                    text-[24px] lg:text-[32px] text-red-600 font-bold">
                        <p>Close thread</p>
                    </div>
                    <div className="">
                        <div className="flex p-4 justify-center">
                            are you sure you want to closed this thread?
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmArchive}>
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
                    text-[24px] lg:text-[32px] text-red-600 font-bold">
                        <p>Delete thread</p>
                    </div>
                    <div className="">
                        <div className="flex p-4 justify-center">
                            are you sure you want to delete this thread?
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal1}>
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

//bookmark section
function BookMarks(){
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [bookmarks, setBookmarks] = useState([]);
    const [selectValue, setSelectValue] = useState('-created_at');
    const [ordering, setOrdering] = useState('-created_at');
    const [statusSelectValue, setStatusSelectValue] = useState('all');

    if(!user){
        toast.warning("you must login to use this page!",{
            position: 'top-right',
            autoClose: 3000,
        })
        
        setTimeout(() => {
            navigate('/login');
        }, 1500);

    }

    const fetchBookmark = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (statusSelectValue && statusSelectValue !== 'all') {
                params.append('status', statusSelectValue);
            }
            params.append('ordering', ordering);

            const { data } = await api.get(`/api/bookmarks/?${params.toString()}`);
            setBookmarks(data.results ?? data);

        } catch (err) {
            console.error('Error fetching bookmarks:', err);
            const msg = err.response?.data?.detail || 'Failed to fetch bookmarks.';
            toast.error(msg, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    }, [ordering, statusSelectValue]);

    
    const [open, setOpen] = React.useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState(null);

    const openModal = (threadId) => {
        setSelectedThreadId(threadId);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setSelectedThreadId(null);
    };

    const handleConfirmDeleteBookmark = async () => {
        await DeleteBookmark(selectedThreadId);
        closeModal();
    };

    const DeleteBookmark = async (id) => {
        try {
            await api.delete(`/api/bookmarks/${id}/`);
            toast.success('Bookmark delete successfully!', {
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

    const [open1, setOpen1] = React.useState(false);
    
    const openModal1 = (threadId) => {
        setSelectedThreadId(threadId);
        setOpen1(true);
    };
    const closeModal1 = () => {
        setOpen1(false);
        setSelectedThreadId(null);
    };

    const handleConfirmPatchBookmark = async () => {
        await PatchBookmark(selectedThreadId);
        closeModal1();
    };
    const [note, setNote] = useState('')

    const PatchBookmark = async (id) => {
        try {
            await api.patch(`/api/bookmarks/${id}/`,{
                note: note
            });
            toast.success('Bookmark updated successfully!', {
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




    useEffect(() => {
        if (!loading) {
            if (!user) {
                toast.error('You must login to use this function!');
                navigate('/login'); 
            } else {
                fetchBookmark(); 
            }
        }
    }, [user, loading, fetchBookmark, navigate]);

    const handleStatusSelectChange = (newStatus) => {
        setStatusSelectValue(newStatus);
        fetchBookmark(ordering, newStatus);
    };
    
    const handleSortChange = (newSort) => {
        setOrdering(newSort);
        fetchBookmark(newSort, statusSelectValue);
    };

    const handleSelectChange = (value) => {
        setSelectValue(value);
        
        if (value.startsWith('status:')) {
            const statusId = value.split(':')[1];
            setStatusSelectValue(statusId);
        } else {
            handleSortChange(value);
        }
    };

    
    if (loading) return(
        <>
        <SideButton/>
        <Navbar/>
        <div className="min-h-screen">
            <section className="flex flex-col items-center">
                <div className="w-[80%]">
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress aria-label="Loading…" />
                    </Box>
                </div>
                </section>
        </div>
        </>
    );
    return(
        <>
        <div className="py-2 min-h-[60vh]">
            <div className="flex justify-end gap-2 sorting">
                <p>Sorting:</p>
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

            <div className="py-2">
                {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {bookmarks.map((bookmark) =>(
                        <div className="card shadow-md">
                            <div className="flex flex-row gap-4">
                                <img 
                                src={bookmark.thread.images?.find((img)=>
                                img.is_thumbnail)?.file || defaultImg} 
                                alt="[object Object]"
                                className="shadow-sm rounded-md"
                                id='thread-thumbnail'/>
                                <div className="thread-title">
                                    <p>{bookmark.thread.title}</p>
                                </div>
                                
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2
                            justify-between">
                                <div className="flex gap-2 items-end p-2">
                                    <p className="date-info">
                                        <span className="text-[#9400D3] font-bold">created:</span> 
                                        {formatDate(bookmark.created_at) }
                                        -
                                        <span className="text-[#9400D3] font-bold">updated:</span> 
                                        {formatDate(bookmark.updated_at) }
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="card-info info-archive">
                                            {bookmark.thread.status_name}
                                        </div>
                                        {/* display the amount of reply */}
                                        <div className="card-info info-reply gap-1">
                                            <i class="bi bi-chat-dots"></i>
                                            {bookmark.thread.replies.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-end items-end gap-2">
                                    <Link to={`/threads/${bookmark.thread.id}`}>
                                        <Button variant="outlined"
                                        className="shadow-md" id='thread-btn-1'>
                                            View
                                        </Button>
                                    </Link>
                                    <Button className="shadow-md" id='thread-btn-3'
                                    onClick={() => openModal1(bookmark.id)}>
                                        Edit
                                    </Button>
                                    <Button variant="delete"
                                    onClick={() => openModal(bookmark.id)} 
                                     className="shadow-md" id='thread-btn-2'>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            <div className="note-box">
                            {bookmark?.note ? (
                                <div className="flex gap-1 items-center">
                                    <DrawIcon/>
                                    <p>Note: {bookmark.note}</p>
                                </div>
                                ): (
                                    <p className="text-gray-400">No note added</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div> ):(
                    <div className="bg-white p-4
                    flex justify-center rounded-md shadow-md">
                        <p className="text-[#9400D3] font-bold">No bookmark found.</p>
                    </div>
                )}
            </div>
        </div>
        <ToastContainer/>
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
                    text-[24px] lg:text-[32px] text-red-600 font-bold">
                        <p>Delete Bookmark</p>
                    </div>
                    <div className="">
                        <div className="flex p-4 justify-center">
                            are you sure you want to delete this bookmark?
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmDeleteBookmark}>
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
                        <p>Update Bookmark</p>
                    </div>
                    <div className="">
                        <div className="flex-col gap-2 p-2">
                            <p className="m-2">are you sure you want to update this bookmark?</p>
                            <textarea name="" id="" placeholder="Enter your thread context"
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            onChange={(e) => setNote(e.target.value)}>
                            </textarea>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal1}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmPatchBookmark}>
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

function Posting(){
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('Anonymous Melon');
    const [context, setContext] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('default');
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const {user, loading} = useAuth()

    useEffect(()=>{
        async function fetchCategories() {
            try {
                const { data } = await api.get('/api/categories/');
                setCategories(data.results ?? data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCategories()
    }, [])

    const handleImageChange= (e) =>{
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 5) {
            setImageError('Only max 5 images, sorry.');
            setImages(selectedFiles.slice(0, 5));
        } else {
            setImageError('');
            setImages(selectedFiles);
        }
    }

    const createThread = async (e) => {
        e.preventDefault();
        if (!user) return;
        if (selectedCategory === 'default') {
            setSubmitError('Please select a category.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('name', username);
        formData.append('user', user.id)
        formData.append('context', context);
        formData.append('category', selectedCategory);
        formData.append('status', 1)
        images.forEach((file) => {
            formData.append('images', file);
        });

        console.log("data: ", Array.from(formData.entries()));
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            await api.post('/api/threads/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Thread created successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            setSubmitError('Failed to create thread.');
            toast.error(`${error}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }

    } 

    
    if (loading) return(
        <>
        <SideButton/>
        <Navbar/>
        <div className="min-h-screen flex flex-col justify-center items-center">
            <Box sx={{ display: 'flex' }}>
                <CircularProgress aria-label="Loading…" />
            </Box>
        </div>
        </>
    );

    return(
        <>
         <div className="py-2 min-h-[60vh]">
            <div className="flex gap-2 pt-4 items-center border-b-2 border-[#9400D3]">
                <i class="bi bi-pencil-square" id="head-icon"></i>
                <p id='header-text'>WRITE A THREAD</p>
            </div>

            {/* rule board */}
            <div class="py-2">
                <div className="card-rule bg-white p-2 border-[#9400D3] border rounded-md">
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
            <ToastContainer/>
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
                    <form action="" onSubmit={createThread}>
                    {/* title */}
                        <div className="p-2">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                {/* Label: Takes auto width on mobile, fixed width on desktop */}
                                <div className="w-full md:w-24 post-label shrink-0">
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
                                    value={title} onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* name */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                <div className="w-full md:w-24 post-label shrink-0">
                                    <p className="font-bold text-left md:text-right text-[#9400D3]">
                                    Name:
                                    </p>
                                </div>
                                <div className="w-full flex-1">
                                    <select name="" id="" 
                                        className="w-full post-thread bg-white rounded-md px-3 py-2 
                                        focus:outline-none focus:ring-2 
                                        border text-[#9400D3] border-[#9400D3]"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}>
                                            <option value="Anonymous Melon" >Anonymous</option>
                                            <option value={user?.username}>{user?.username}</option>
                                    </select>
                                </div>
                            </div>

                            {/* category */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                <div className="w-full md:w-24 post-label shrink-0">
                                    <p className="font-bold text-left md:text-right text-[#9400D3]">
                                    Category:
                                    </p>
                                </div>
                                <div className="w-full flex-1">
                                    <select name=""
                                    id="" className="w-full post-thread bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}>
                                        <option value="default" selected>Pick a category</option>
                                        {categories.map((category) => (
                                            <option 
                                            disabled={category.status_name === 'Suspend'}
                                            key={category.id} value={category.id}>{category.title}</option>
                                        ))} 
                                    </select>
                                </div>
                            </div>

                            {/* context */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                <div className="w-full md:w-24 post-label shrink-0">
                                    <p className="font-bold text-left md:text-right text-[#9400D3]">
                                    Content:
                                    </p>
                                </div>
                                <div className="w-full flex-1">
                                    <textarea name="" id="" placeholder="Enter your thread context"
                                    className="w-full post-thread bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]"
                                    value={context} onChange={(e) => setContext(e.target.value)}></textarea>
                                </div>
                            </div>

                            {/* file */}
                            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                <div className="w-full md:w-24 post-label shrink-0">
                                    <p className="font-bold text-left md:text-right text-[#9400D3]">
                                    Images:
                                    </p>
                                </div>
                                <div className="w-full flex-1">
                                    <input placeholder="Enter thread title"
                                    type="file" className="w-full post-thread bg-white rounded-md px-3 py-2 
                                    focus:outline-none focus:ring-2 
                                    border text-[#9400D3] border-[#9400D3]" 
                                    onChange={handleImageChange}
                                    id="" />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end">
                                {submitError && <p className="text-red-500">{submitError}</p>}
                                <Button 
                                className="shadow-lg hover:shadow-2xl transition-all duration-300"
                                variant="contained" id="post-btn" type="submit"
                                startIcon={<SendIcon />}>
                                    Post Thread
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

function Profile(){
    const {user,loading} = useAuth()
    const navigate = useNavigate();

    if(!user){
        toast.warning("you must login to use this page!",{
            position: 'top-right',
            autoClose: 3000,
        })
        
        setTimeout(() => {
            navigate('/login');
        }, 1500);

    }

    useEffect(()=>{
        
        if (!loading && !user) {
            toast.warning('You must be logged in to use this page!', {
                position: 'top-right',
                autoClose: 2000,
            });

            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    },[user, navigate, loading])

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
        <ToastContainer/>
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
                    <div className="pb-4">
                        <div class="grid grid-cols-6 gap-4">
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
                                {/* routerlink section */}
                                <div className="nav-bar flex gap-2">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            className={`px-3.5 py-1.5 text-base font-bold rounded-full border border-[#9400D3] transition-all duration-300 capitalize ${
                                                activeTab === 'overview'
                                                ? 'bg-[#9400D3] text-white shadow-md'
                                                : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                            }`}
                                            >
                                            Account Manager
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('thread-overview')}
                                            className={`px-3.5 py-1.5 text-base font-bold rounded-full border border-[#9400D3] transition-all duration-300 capitalize ${
                                                activeTab === 'thread-overview'
                                                ? 'bg-[#9400D3] text-white shadow-md'
                                                : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                            }`}
                                            >
                                            Thread Manager
                                        </button>
                                       <button
                                            onClick={() => setActiveTab('bookmark')}
                                            className={`px-3.5 py-1.5 text-base font-bold rounded-full border border-[#9400D3] transition-all duration-300 capitalize ${
                                                activeTab === 'bookmark'
                                                ? 'bg-[#9400D3] text-white shadow-md'
                                                : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                            }`}
                                            >
                                            Bookmark Manager
                                        </button>
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