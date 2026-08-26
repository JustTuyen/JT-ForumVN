/* eslint-disable react-hooks/set-state-in-effect */
import { Button } from "@mui/material";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import SideButton from "../../component/SideButton";
import { Link, useParams } from "react-router";
import Profile01 from '../../assets/profile01.png'
import { useCallback, useEffect, useState } from "react";
import forumThumbnail from '../../assets/profileDefault.jpg'
import {toast, ToastContainer} from 'react-toastify'
import {Card, CardActionArea} from "@mui/material";
import '../css/User.css'
import {formatDate} from './profile/style/Modals.jsx'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import api from "../../auth/ApiHandle";
import SendIcon from '@mui/icons-material/Send';

function ThreadOverView(){
    const { id } = useParams();
    const [ordering, setOrdering] = useState('-created_at');
    const [statusSelectValue, setStatusSelectValue] = useState('all');
    const [threads, setThread] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectValue, setSelectValue] = useState('-created_at');
    
    const fetchThread = useCallback(async (
        sortParam = ordering, 
        statusParam = statusSelectValue
    )=>{

        if (!id) return;
        setLoading(true);

        try{
            const params = new URLSearchParams()
            if(statusParam && statusParam !== 'all'){
                params.append('status', statusParam)
            }
            params.append('ordering', sortParam)
            const { data } = await api.get(`/api/users/${id}/threads/?${params.toString()}`);
            setThread(data.results ?? data);
        
        } catch (err) {
            console.error('Error fetching threads:', err);
            const msg = err.response?.data?.detail || 'Failed to fetch threads.';
            toast.error(msg, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally{
            setLoading(false)
        }
    },[id,ordering,statusSelectValue])

    useEffect(()=>{
        
        fetchThread()
         
    }, [id])
    
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

   if (loading) return(
        <>
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
        <div className="min-h-[60vh]">
            <div className="flex justify-end gap-2 sorting">
                <p>Sorting:</p>
                <select value={selectValue} onChange={(e) => handleSelectChange(e.target.value)}>
                    <option value="title">A-Z</option>
                    <option value="-title">Z-A</option>
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
            <div className="pb-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                    {threads.map((thread) => (
                    <Link to={`/threads/${thread.id}`} key={thread.id} className="block no-underline">
                        <Card key={thread.id}>
                            <CardActionArea>
                                <div className="grid grid-cols-3">
                                    <div class="p-2">
                                        <img 
                                        src={thread.images?.find((img)=>
                                        img.is_thumbnail)?.file || forumThumbnail} 
                                        alt={thread.images?.find((img) => img.is_thumbnail)?.alt_text || 'default thumbnail'}
                                        className="shadow-sm rounded-md thumbnail-img"/>
                                    </div>
                                    <div class="col-span-2 p-2">
                                        <div id="card-title">
                                            <p>{thread.title}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 p-1 items-end justify-end">
                                    {/* archive to display status */}
                                    <div className="card-info info-archive">
                                        <p>{thread.status_name}</p>
                                    </div>
                                    {/* display the amount of reply */}
                                    <div className="card-info info-reply gap-1">
                                        <i class="bi bi-chat-dots"></i>
                                        {}
                                    </div>
                                </div>
                            </CardActionArea>
                        </Card>
                    </Link>
                    ))}
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
const {id} = useParams()
const [loading, setLoading] = useState(true)
const [user, setUser] = useState('')
    async function userProfileReview(){
        try{
            
            const {data} = await api.get(`/api/users/${id}/profile/`)
            setUser(data)
            //console.log('data:', data.result ?? data)

        } catch (error){
            toast.error(`error loading thread: ${error}`,
                {
                    position: 'top-right',
                    autoClose: 1500,
                }
            )

        } finally{
            setLoading(false)
        }
    }
    

    //const [activeTab, setActiveTab] = useState('thread-overview');
    // const renderSubView = () => {
    //     switch(activeTab){
    //         case 'thread-overview':
    //             return <ThreadOverView/>;
    //         // case 'bookmarks':
    //         //     return <Bookmarks/>;
    //     }
    // }

    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('Anonymous Melon');
    const [context, setContext] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('default');
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState('');
    const [submitError, setSubmitError] = useState('');

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

       
        try {
            await api.post('/api/threads/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Thread created successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (err) {
            setSubmitError('Failed to create thread.');           
            toast.error(`${err}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }

    } 
    useEffect(()=>{
        if(id){
            userProfileReview()
        }   

        async function fetchCategories() {
            try {
                const { data } = await api.get('/api/categories/');
                setCategories(data.results ?? data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchCategories()

    }, [id])


    const [ordering, setOrdering] = useState('-created_at');
    const [statusSelectValue, setStatusSelectValue] = useState('all');
    const [threads, setThread] = useState([]);
    const [selectValue, setSelectValue] = useState('-created_at');
    
    const fetchThread = useCallback(async (
        sortParam = ordering, 
        statusParam = statusSelectValue
    )=>{

        if (!id) return;
        setLoading(true);

        try{
            const params = new URLSearchParams()
            if(statusParam && statusParam !== 'all'){
                params.append('status', statusParam)
            }
            params.append('ordering', sortParam)
            const { data } = await api.get(`/api/users/${id}/threads/?${params.toString()}`);
            setThread(data.results ?? data);
        
        } catch (err) {
            console.error('Error fetching threads:', err);
            const msg = err.response?.data?.detail || 'Failed to fetch threads.';
            toast.error(msg, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally{
            setLoading(false)
        }
    },[id,ordering,statusSelectValue])

    useEffect(()=>{
        
        fetchThread()
         
    }, [id])
    
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



    if (loading) {
        return(
            <>
                <div className="flex justify-center p-8">
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress aria-label="Loading…" />
                    </Box>
                </div>
            </>
        )
    }

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
                                Profile
                            </Button>
                        </Link>
                        <i className="bi bi-chevron-double-right"></i>
                        <Button 
                        variant="contained"
                        className="shadow-lg hover:shadow-2xl 
                        transition-all duration-300" id="navigator-btn"
                        >
                            {user.username}
                        </Button>       
                    </div>

                    {/* user information */}
                    <div className="user-info flex flex-row gap-4 items-center">
                        <img src={Profile01} alt="user-profile" id="user-icon"/>
                        <div className="flex flex-col gap-2">
                            {/* username and threads */}
                            <div className="flex flex-row gap-4 items-center">
                                <p className="user-name">{user.username}</p>
                                <p className="user-thread">Owner of
                                    <span className="text-[#9400D3] font-bold mx-1">{threads.length}</span>
                                    thread
                                </p>
                            </div>
                            <div className="text-[14px]">
                                <p className="user-context whitespace-pre-line">
                                    {user.description}
                                </p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <i class="bi bi-calendar-check-fill text-[#9400D3]"></i>
                                <p>Joined since {formatDate(user.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* thread and bookmarks     */}
                    <div className="">
                        <div className="py-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {/* <button
                                onClick={() => setActiveTab('thread-overview')}
                                className={`
                                    px-3.5 py-1.5 text-[16px] font-medium rounded-md 
                                    border border-[#9400D3] transition-all duration-300"
                                    capitalize ${
                                    activeTab === 'thread-overview'
                                    ? 'bg-[#9400D3] text-white shadow-md'
                                    : 'bg-white text-[#9400D3] hover:bg-[#9400D3] hover:text-white'
                                }`}
                                >
                               Threads
                            </button> */}
                            
                            {/* <button
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
                            </button> */}
                        </div>
                        {/* routerlink content */}
                        <div className="min-h-[60vh]">
                            <div className="flex justify-end gap-2 sorting">
                                <p>Sorting:</p>
                                <select value={selectValue} onChange={(e) => handleSelectChange(e.target.value)}>
                                    <option value="title">A-Z</option>
                                    <option value="-title">Z-A</option>
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
                            <div className="pb-10">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                                    {threads.map((thread) => (
                                    <Link to={`/threads/${thread.id}`} key={thread.id} className="block no-underline">
                                        <Card key={thread.id}>
                                            <CardActionArea>
                                                <div className="grid grid-cols-3">
                                                    <div class="p-2">
                                                        <img 
                                                        src={thread.images?.find((img)=>
                                                        img.is_thumbnail)?.file || forumThumbnail} 
                                                        alt={thread.images?.find((img) => img.is_thumbnail)?.alt_text || 'default thumbnail'}
                                                        className="shadow-sm rounded-md thumbnail-img"/>
                                                    </div>
                                                    <div class="col-span-2 p-2">
                                                        <div id="card-title">
                                                            <p>{thread.title}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 p-1 items-end justify-end">
                                                    {/* archive to display status */}
                                                    <div className="card-info info-archive">
                                                        <p>{thread.status_name}</p>
                                                    </div>
                                                    {/* display the amount of reply */}
                                                    <div className="card-info info-reply gap-1">
                                                        <i class="bi bi-chat-dots"></i>
                                                        {}
                                                    </div>
                                                </div>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pb-15" id="reply-box">
                        <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                           <i class="bi bi-pencil-square" id="head-icon"></i>
                            <p id='header-text'>WRITE A THREAD</p>
                        </div>

                        {/* rule board */}
                        <div class="py-2">
                            <div className="card bg-white p-2 border-[#9400D3]rounded-md">
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

                            <div className="">
                                {/* title */}
                                <form action="" onSubmit={createThread}>
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
                                                <input required
                                                placeholder="Enter thread title"
                                                type="text" 
                                                className="w-full post-thread bg-white rounded-md px-3 py-2 
                                                focus:outline-none focus:ring-2 
                                                border text-[#9400D3] border-[#9400D3]" 
                                                id="title" 
                                                value={title} onChange={(e) => setTitle(e.target.value)}
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
                                               <select name="" id="" required
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
                                            <div className="w-full md:w-24 post-label flex-shrink-0">
                                                <p className="font-bold text-left md:text-right text-[#9400D3]">
                                                Category:
                                                </p>
                                            </div>
                                            <div className="w-full flex-1">
                                                <select name="" required
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
                                            <div className="w-full md:w-24 post-label flex-shrink-0">
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

                                        <div className="flex flex-col md:flex-row items-start md:items-center 
                                        gap-2 md:gap-4 py-2"
                                        >
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
                                                id="" 
                                                onChange={handleImageChange}
                                                />
                                                {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
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
                </div>
            </section>
        </div>
        <Footer/>
        </>
    )
}

export default User;