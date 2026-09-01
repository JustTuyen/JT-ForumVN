/* eslint-disable react-hooks/set-state-in-effect */
import SideButton from "../../component/SideButton";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { Link, useNavigate, useParams } from "react-router";
import { Button,IconButton  } from "@mui/material";
// import {Card, CardActionArea} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import '../css/Thread.css'
//images
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from "react";
import api from "../../auth/ApiHandle";
import { useAuth } from "../../auth/AuthContext";
//
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {formatDate, modalStyle2} from './profile/style/Modals'
import { ToastContainer, toast } from 'react-toastify';     
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Tooltip from '@mui/material/Tooltip';


function ThreadImagesGallery({images}){
    if(!images || images.length == 0)
        return null

    return(
        <>
        <div className="thread-img grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {images.map((img) =>(
                <div className="" key={img.id}>
                    <img src={img.file} alt={img.alt_text || 'Thread image'} 
                    id="thread-imgs"
                    loading="lazy"/>
                </div> 
            ))}
        </div>
        </>
    )
}

function ReplyCard({reply, index, user, onSelectReply, scrollToReply}){
    
    const [likeCount, setLikeCount] = useState(reply?.like_count || 0);
    const [isLiked, setIsLiked] = useState(reply?.is_liked || false);
    
    const handleLike = async()=>{
        if(!user){
            toast.warning('please login to like this reply!',{
                position: 'top-right',
                autoClose: 1000,
            })
            return
        }

        const wasLiked = isLiked
        setIsLiked(!wasLiked)
        setLikeCount((prev)=>(wasLiked ? Math.max(0, prev-1):prev + 1))
        try{
            const {data} = await api.post(`/api/replies/${reply.id}/like_reply/`);
            if (data.like_count !== undefined) setLikeCount(data.like_count);
            if (data.is_liked !== undefined) setIsLiked(data.is_liked);
        
        } catch (err) {
            // Rollback on error
            setIsLiked(wasLiked);
            setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));

            const msg = err.response?.data?.detail || 'Failed to update like status.';
            toast.error(msg, { position: 'top-right', autoClose: 1500 });
        }
    }

    const [selectReplyId, setSelectReplyId] = useState(null);
    const [reason, setReason] = useState('')
    const [violationType, setViolationType] = useState('')
    const [open, setOpen] = React.useState(false);
    const openModal = (threadId) => {
        setSelectReplyId(threadId);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setSelectReplyId(null);
    };

    const handleConfirmReport = async () => {
        await ReportThread(selectReplyId);
        closeModal();
    };

    const ReportThread = async () => {
        try {
            await api.post(`/api/reports/`,{
                violation_type: violationType,
                reason: reason,
                point_punishment: 10,
                user: user.id,
                content_type: 11,
                object_id: selectReplyId,
                status: 15
            });

            toast.success('Report create successfully!', {
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

    const navigate = useNavigate();
    const loadingUser = (userid, username) => {
        if (username === 'Anonymous Melon') {
            toast.warning('This user chose to be anonymous.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        navigate(`/user/${userid}`);
    };

    return (
        <>
        <div className="card p-4 rounded-md" key={reply?.id} id={`${reply?.id}`}>
            <div className="gap-2 thread-info flex justify-start items-center">
                <div 
                    className="index-box gap-2 flex cursor-pointer" 
                    onClick={() => onSelectReply && onSelectReply(reply?.id)}
                >
                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                    <p>{index + 2}</p>
                </div>

                <p>
                    <span className="cursor-pointer" onClick={() => loadingUser(reply.user, reply.name)}>
                        {reply.name}
                    </span>
                    {' '}- {formatDate(reply?.created_at)}
                </p>    

                <div className="flex gap-2 p-2">
                    <div className="flex flex-row items-center">
                        <IconButton 
                            color="secondary" 
                            aria-label="like reply"
                            onClick={handleLike}
                        >
                            {isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                        </IconButton>
                        {/* Render actual like count */}
                        <p>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>
                    </div>

                    <Button variant="outlined" id="report-btn" onClick={() => openModal(reply.id)}>
                        Report
                    </Button>
                </div>
            </div>
            {reply.status_name !== 'Suspended'?(                
                <div className="thread-context">
                    <p className="mt-2 mb-8 whitespace-pre-line">
                        {reply?.context}
                    </p>
                </div>
                ):(

                <div className="thread-context">
                    <p className="mt-2 mb-8 opacity-65 
                    whitespace-pre-line">
                        This response has been deleted.
                    </p>
                </div>
            )}

            <ThreadImagesGallery images={reply?.images} />

            {reply?.parent_reply && (
                <div 
                    className="flex gap-1 cursor-pointer" 
                    onClick={() => scrollToReply && scrollToReply(reply.parent_reply)}
                >
                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                    <p>{reply?.parent_reply}</p>
                </div>
            )}
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
                        <p>Report thread</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <p>Are you sure you want to report this thread?</p>
                            <select name="" id="" value={violationType}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2
                            border text-[#9400D3] border-[#9400D3]"
                            onChange={(e) => setViolationType(e.target.value)}>
                                <option value="Spam" selected>Type of violation</option>
                                <option value="Spam">Spam</option>
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
                            onClick={handleConfirmReport}>
                                Yes
                            </Button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
        </>
    );
}

function ThreadRepliesGallery({
    replies = [], user, onSelectReply, scrollToReply
}){
    
    return (
        <>
            {replies.map((reply, index) => (
                <ReplyCard
                    key={reply?.id || index}
                    reply={reply}
                    index={index}
                    user={user}
                    onSelectReply={onSelectReply}
                    scrollToReply={scrollToReply}
                />
            ))}
        </>
    );
}

function Thread(){
    const {id} = useParams()
    const [thread, setThread] = useState(null)
    const [loading, setLoading] = useState(true);
    const [context, setContext] = useState('');
    const [username, setUsername] = useState('Anonymous Melon');
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState('');
    const {user} = useAuth()
    //
    const [parentReplyId, setParentReplyId] = useState(null)
    const handleClearParent = () =>{
        setParentReplyId(null)
    }
    //
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

    const createReply = async(e) =>{
        e.preventDefault();
        if (!user) return;
        const formData = new FormData();
        formData.append('name', username); 
        formData.append('user', user.id)
        formData.append('thread',id)
        formData.append('status', 14)
        formData.append('context', context);
        if (parentReplyId) {
            formData.append('parent_reply', parentReplyId);
        }
        images.forEach((file) => {
            formData.append('images', file);
        });

        console.log("data: ", Array.from(formData.entries()));
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            await api.post('/api/replies/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('reply created successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });

        } catch (err) {
            toast.error(`${err}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
        
    }

    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    async function fetchThreadDetails() {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/threads/${id}/`);
            setThread(data);
            
            setLikeCount(data.like_count || 0);
            setIsLiked(data.is_liked || false); 
            setLoading(false);

        } catch (err) {

            toast.err(`error loading thread: ${err}`,
            {
                position: 'top-right',
                autoClose: 1500,
            }
        )
            setLoading(false);
        }
    }
    
    const scrollToReply = (replyId)=>{
        const targetElement = document.getElementById(`${replyId}`); 
        if (targetElement) {
        // 1. Smoothly scroll into view
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 2. Add temporary visual highlight effect
            targetElement.classList.add('bg-purple-100', 'ring-2', 'ring-[#9400D3]');
            
            // 3. Remove highlight after 2 seconds
            setTimeout(() => {
                targetElement.classList.remove('bg-purple-100', 'ring-2', 'ring-[#9400D3]');
            }, 2000);
        }
    }
    const likingThread = async () => {
        if (!user) {
            toast.warning('Please log in to like this thread.',{
                position: 'top-right',
                autoClose: 1500,
            });
            return;
        }

        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

        try {
            const { data } = await api.post(`/api/threads/${id}/like_thread/`);
            
            if (data.like_count !== undefined) setLikeCount(data.like_count);
            if (data.liked !== undefined) setIsLiked(data.liked);

        } catch (err) {
            setIsLiked(wasLiked);
            setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));

            const msg = err.response?.data?.detail || 'Failed to update like status.';
            toast.error(msg, {
                position: 'top-right',
                autoClose: 1500,
            });
        }
    };

    const [note, setNote] = useState('')
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

    const handleConfirmBookmark = async () => {
        await bookmarkThread(selectedThreadId);
        closeModal();
    };

    const bookmarkThread = async (id) => {
        try {
            await api.post(`/api/threads/${id}/thread_bookmark/`,{
                note: note
            });

            toast.success('Thread bookmark successfully!', {
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

    const [reason, setReason] = useState('')
    const [violationType, setViolationType] = useState('')
    const [open1, setOpen1] = React.useState(false);
    const openModal1 = (threadId) => {
        setSelectedThreadId(threadId);
        setOpen1(true);
    };
    const closeModal1 = () => {
        setOpen1(false);
        setSelectedThreadId(null);
    };

    const handleConfirmReport = async () => {
        await ReportThread(selectedThreadId);
        closeModal();
    };

    const ReportThread = async () => {
        try {
            await api.post(`/api/reports/`,{
                violation_type: violationType,
                reason: reason,
                point_punishment: 10,
                user: user.id,
                content_type: 12,
                object_id: id,
                status: 15
            });

            toast.success('Report create successfully!', {
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


    useEffect(()=>{
        if (id) {
            fetchThreadDetails();
        }
    }, [id])

    
    const navigate = useNavigate();
    const loadingUser = (userid, username) => {
        console.log('userid:', userid, typeof userid);
        console.log('user.id:', user?.id, typeof user?.id);

        if (username === 'Anonymous Melon') {
            toast.warning('This user chose to be anonymous.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (userid === user?.id) {
            navigate('/profile');
            return;
        }
        
        navigate(`/user/${userid}`);
    };


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
        <ToastContainer/>
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
                                {thread.category_name}
                            </Button>
                        </Link>                   
                    </div>

                    {/* reply column */}
                    <div className="flex flex-col gap-2 pb-20">

                        {/* thread card      */}
                        <div className="card p-4 rounded-md">

                            {/* thread title */}
                            <div id="thread-title" className="flex gap-2">
                                <p>{thread?.title}</p>
                                <Tooltip describeChild title="Click here if you want to bookmark this thread.">
                                    <button onClick={() => openModal(thread.id)}>
                                        <StarIcon className="text-yellow-300"/>
                                    </button>
                                </Tooltip>
                                
                            </div>

                            {/* thread info */}
                            <div className="gap-2 thread-info flex justify-start items-center">
                                {/* indexing */}
                                <div className="index-box gap-2 flex">
                                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                                    <p>1</p>
                                </div>
                                
                                <p>
                                    <span className="cursor-pointer" onClick={() => loadingUser(thread.user, thread.user_username)}>
                                        {thread?.user_username}
                                    </span>
                                    {' '}- {formatDate(thread?.created_at)}
                                </p>                             
                                <div className="flex gap-2 p-2">
                                    <div className="flex flex-row items-center">
                                        <IconButton color="secondary"
                                        onClick={likingThread}
                                        aria-label="add an alarm">
                                            {isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                                        </IconButton>
                                        <p>{likeCount} likes</p>
                                    </div>
                                    <Button variant="outlined" id="report-btn"
                                    onClick={() => openModal1(thread.id)}>
                                        Report
                                    </Button>
                                </div>
                            </div>


                            <div className="thread-context">
                                <p className="mt-2 mb-8 whitespace-pre-line">
                                    {thread?.context}
                                </p>
                                
                            </div>
                            <ThreadImagesGallery images={thread?.images}/>
                        </div>
                        <ThreadRepliesGallery 
                        replies={thread?.replies} 
                        user={user} 
                        onSelectReply={(id) => setParentReplyId(id)}
                        scrollToReply={scrollToReply}/>
                    </div>

                    {thread?.status_name === 'Active' &&
                    <div className="flex justify-center m-4 rounded-md
                    shadow-md
                    p-4 bg-[#FFB6C1]">
                        <KeyboardDoubleArrowRightIcon className="text-[#D6336C]"/>
                        <p className="text-[#D6336C]">The thread will be deleted around {formatDate(thread.expire_at)}</p>
                        <KeyboardDoubleArrowLeftIcon className="text-[#D6336C]"/>
                    </div>
                    }


                    {thread?.status_name === 'Active' ? (
                        <div className="pb-10">
                            <ToastContainer/>

                            <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                            <i class="bi bi-pencil-square" id="head-icon"></i>
                                <p id='header-text'>Write a reply</p>
                            </div>

                            <div className="grid grid-cols-1">
                                <div id="reply-box">
                                    <div className="py-4">
                                        <form action=""  onSubmit={createReply}>
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
                                        
                                        {/* context */}
                                             {parentReplyId && (
                                                <div className="flex items-center gap-2 font-parent">
                                                    <SendIcon></SendIcon>
                                                    <p className="">
                                                        Replying to #{parentReplyId}
                                                        <IconButton aria-label="delete" onClick={handleClearParent}>
                                                            <CancelIcon />
                                                        </IconButton>
                                                    </p>
                                                </div>
                                            )}
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
                                                    value={context} onChange={(e) => setContext(e.target.value)}>
                                                    </textarea>
                                                </div>
                                            </div>

                                            {/* file */}
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                                <div className="w-full md:w-24 post-label shrink-0">
                                                    <p className="font-bold text-left md:text-right text-[#9400D3]">
                                                    Images:
                                                    </p>
                                                </div>
                                                <div className="w-full flex-1">
                                                    {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
                                                    <input placeholder="Enter thread title"
                                                    type="file" className="w-full post-thread bg-white rounded-md px-3 py-2 
                                                    focus:outline-none focus:ring-2 
                                                    border text-[#9400D3] border-[#9400D3]" 
                                                    id="" 
                                                    onChange={handleImageChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex justify-end">
                                                <Button 
                                                className="shadow-lg
                                                hover:shadow-2xl transition-all duration-300"
                                                variant="contained" id="post-btn"
                                                type="submit"
                                                startIcon={<SendIcon />}>
                                                    Post Reply
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    ):(
                        <div className="pb-10">
                            <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                                <i class="bi bi-pencil-square" id="head-icon"></i>
                                <p id='header-text'>This thread has been archived.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
        <Footer/>
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
                        <p>Bookmark thread</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <p>Are you sure you want to bookmark this thread?</p>
                            <textarea name="" id=""
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            placeholder="Leave a note if you want">

                            </textarea>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmBookmark}>
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
                        <p>Report thread</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <p>Are you sure you want to report this thread?</p>
                            <select name="" id="" value={violationType}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2
                            border text-[#9400D3] border-[#9400D3]"
                            onChange={(e) => setViolationType(e.target.value)}>
                                <option value="Spam" selected>Type of violation</option>
                                <option value="Spam">Spam</option>
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
                            onClick={handleConfirmReport}>
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

export default Thread;