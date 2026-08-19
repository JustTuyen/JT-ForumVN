import Navbar from "../../component/Navbar";
import '../css/Home.css'
import {Button} from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {Card,CardActionArea } from '@mui/material'
import forumThumbnail from '../../assets/profileDefault.jpg'
import SendIcon from '@mui/icons-material/Send';
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';
import ChatIcon from '@mui/icons-material/Chat';
import Footer from "../../component/Footer";
import SideButton from "../../component/SideButton";
import { useEffect, useState } from "react";
import api from "../../auth/ApiHandle";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router";
//toatify
import { ToastContainer, toast } from 'react-toastify';

function Home(){

    //The double return array is normal cuz of strictmode
    const [threads, setThread] = useState([])
    //creat forum
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
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
        async function fetchThreads(){
            try{
                const {data} =  await api.get('/api/threads/listings/')
                setThread(data);
                console.log('data', data);
            } catch(error){
                console.error(error)
            }
        }
        fetchThreads(),
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

    if (loading) return <p>Loading...</p>;

    return(
        <>
            <Navbar/>
            <SideButton targetId="reply-box"/>
            <div className="min-h-screen">
                <div className="banner flex justify-center items-center">
                    <div className="gap-4 flex flex-col">
                        {/* banner and jump btns */}
                        <div className="flex p-2 flex-col justify-center items-center">
                            <p id="heading">HEADING FOR WEBSITE THIS IS FORUM_VN</p>
                            <p id="heading-description">mainly for only discussion and stuff</p>
                        </div>
                        {/* banner and jump btns */}
                        <div className="grid grid-cols-2 
                        lg:grid-cols-4 gap-2 md:gap-4">
                            <div>
                                <Button 
                                fullWidth
                                variant="contained"
                                startIcon={<LocalFireDepartmentIcon />}
                                className="shadow-lg hover:shadow-2xl 
                                transition-all duration-300 h-full" id="heading-btn"
                                >
                                Top Threads
                                </Button>
                            </div>

                            <div>
                                <Button 
                                fullWidth
                                variant="contained"
                                startIcon={<LoyaltyIcon />}
                                className="shadow-lg hover:shadow-2xl 
                                transition-all duration-300 h-full" id="heading-btn"
                                >
                                Recommended<span className="hidden sm:inline">&nbsp;for you</span>
                                </Button>
                            </div>

                            <div>
                                <Button 
                                fullWidth
                                variant="contained"
                                startIcon={<AccessAlarmIcon />}
                                className="shadow-lg hover:shadow-2xl 
                                transition-all duration-300 h-full" id="heading-btn"
                                >
                                New Arrivals
                                </Button>
                            </div>

                            <div>
                                <Button 
                                fullWidth
                                variant="contained"
                                startIcon={<TipsAndUpdatesIcon />}
                                className="shadow-lg hover:shadow-2xl 
                                transition-all duration-300 h-full" id="heading-btn"
                                >
                                Surprise Me
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="flex flex-col py-4 items-center">
                    {/* forum hot */}
                    <div className="w-[80%] pb-15">
                        <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                           <i class="bi bi-bar-chart-fill" id="head-icon"></i>
                            <p id='header-text'>MOST VIEWS</p>
                        </div>
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
                                                alt="[object Object]" id="thumbnail-img"
                                                className="shadow-sm rounded-md"/>
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
                                                {thread.reply_count}
                                            </div>
                                        </div>
                                    </CardActionArea>
                                </Card>
                            </Link>
                            ))}
                        </div>
                    </div>

                    {/* forum rercommend forum */}
                    <div className="w-[80%] pb-15">
                        <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                           <i class="bi bi-tags-fill" id="head-icon"></i>
                            <p id='header-text'>RECOMMENED</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                            <Card>
                                <CardActionArea>
                                    <div className="grid grid-cols-3">
                                        <div class="p-2">
                                            <img src={forumThumbnail} alt="thread thubmail" 
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

                    {/* write a thread */}
                    <ToastContainer/>
                    <div className="w-[80%] pb-15" id="reply-box">
                        <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                           <i class="bi bi-pencil-square" id="head-icon"></i>
                            <p id='header-text'>WRITE A THREAD</p>
                        </div>

                        {/* rule board */}
                        <div class="py-2">
                            <div className="card bg-white w-[100%] p-2 border-[#9400D3] border-1 rounded-md">
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
                                                <input 
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
                                            <div className="w-full md:w-24 post-label flex-shrink-0">
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
                                                        <option key={category.id} value={category.id}>{category.title}</option>
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
                </section>
                <section>
                    <div className="w-full min-h-100 bg-[#D8BFD8] flex justify-center items-center">
                        <div className="p-2">
                            <p id="heading">More function to comes when I think of something</p>
                            <p id="heading-description">if you has any thoughts, please share with me</p>
                            <div className="flex justify-center gap-2 p-2">
                                <Button 
                                className="shadow-lg hover:shadow-2xl transition-all duration-300"
                                variant="contained" id="future-btn-1"
                                startIcon={<KeyboardCapslockIcon />}>
                                    Up
                                </Button>
                                <Button 
                                className="shadow-lg hover:shadow-2xl transition-all duration-300"
                                variant="contained" id="future-btn-2"
                                startIcon={<ChatIcon />}>
                                    Talk to me
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
        </>
    )
}
export default Home;