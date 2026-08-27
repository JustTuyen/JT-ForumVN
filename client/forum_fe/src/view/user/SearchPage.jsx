/* eslint-disable react-hooks/set-state-in-effect */
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import '../css/Search.css'
import forumThumbnail from '../../assets/profileDefault.jpg'
import {Card,CardActionArea } from '@mui/material'
import { Button } from "@mui/material";
import { Link, useSearchParams } from "react-router";
import SendIcon from '@mui/icons-material/Send';
import SideButton from "../../component/SideButton";
import { useCallback, useEffect, useState } from "react";
import api from "../../auth/ApiHandle";
import {toast, ToastContainer} from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from "../../auth/AuthContext";

function Search(){
    
    // sorting
    const [keyword] = useSearchParams()
    const query = keyword.get('q') || ''
    const [threads, setThread] = useState([])
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [ordering, setOrdering] = useState('-created_at');
    const [isShuffled, setIsShuffled] = useState(false);

    const fetchSearchThreads = useCallback(async(
        sortParam = ordering,
        shuffleParam = isShuffled,
        categoryParam = selectedCategoryFilter) =>{
           
            if(!query){
                setThread([])
                setLoading(false)
                return
            }

            setLoading(true)
    
        try {
            const params = new URLSearchParams();
            params.append('q', query)

            if (categoryParam && categoryParam !== 'all') {
                params.append('category', categoryParam);
            }
            if (shuffleParam) {
                params.append('shuffle', 'true');
            } else {
                params.append('ordering', sortParam);
            }

            const { data } = await api.get(`/api/threads/searcher/?${params.toString()}`);
            setThread(data.results ?? data);

        } catch (error) {
            toast.error(`There is an error fetching search result!: ${error}`,{
                position: 'top-right',
                autoClose: 1000,
            })
        } finally{
            setLoading(false);
        }
    },[ordering, isShuffled, selectedCategoryFilter, query]);
 
    
       
    
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
        fetchSearchThreads()
    }, [query])

    const handleCategoryFilterChange = (categoryId) => {
        setSelectedCategoryFilter(categoryId);
        fetchSearchThreads(ordering, false, categoryId);   // also cancels shuffle when filtering by category, adjust if not desired
    };

    const handleShuffle = () => {
        setIsShuffled(true);
        fetchSearchThreads(ordering, true);
    };

    const handleSortChange = (newSort) => {
        setOrdering(newSort);
        setIsShuffled(false);
        fetchSearchThreads(newSort, false);
    };

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
    //create a threads
    const [selectedCategory , setSelectedCategory] = useState('all');
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('Anonymous Melon');
    const [context, setContext] = useState('');
     const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const {user} = useAuth()

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
                                Search
                            </Button>
                        </Link>
                        <i className="bi bi-chevron-double-right"></i>
                        <Link to="/">
                            <Button 
                            variant="contained"
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300" id="navigator-btn"
                            >
                                {query}
                            </Button>
                        </Link>                   
                    </div>

                    {/* keyword */}
                    <div className="p-2 search-box">
                        <p>Search results for 
                            <span className="font-bold mx-2">"{query}"</span>: 1 to {threads.length} of results</p>
                    </div>
                    <div className="flex sorting gap-2 p-2">
                        <div className="flex justify-center gap-2">
                            <i class="bi bi-sort-down"></i>
                            <p>Sorting:</p> 
                        </div>
                        {/* sorting buttons */}
                        <div className="grid grid-cols-2 
                        lg:grid-cols-5 gap-2 md:gap-4">
                            <Button 
                            
                            variant="contained"
                            startIcon={<LocalFireDepartmentIcon />}
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300 h-full" id="nav-btn"
                            onClick={() => handleSortChange('-view_count')}
                            >
                            Popular
                            </Button>
                            <Button 
                            
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300 h-full" id="nav-btn"
                            onClick={() => handleSortChange('-updated_at')}
                            >
                            Latest Update
                            </Button>
                            <Button 
                            
                            variant="contained"
                            startIcon={<AvTimerIcon />}
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300 h-full" id="nav-btn"
                            onClick={() => handleSortChange('-created_at')}
                            >
                            New Arrivals
                            </Button>
                            <Button 
                            
                            variant="contained"
                            startIcon={<ShuffleIcon />}
                            className="shadow-lg hover:shadow-2xl 
                            transition-all duration-300 h-full" id="nav-btn"
                            onClick={handleShuffle}
                            >
                            Shuffle
                            </Button>
                            <div className="" id="nav-select">
                                <select onChange={(e) => handleCategoryFilterChange(e.target.value)}>
                                    <option value="default">Pick a category</option>
                                    <option value="all" selected>All Categories</option>
                                    {categories.map((category) => (
                                        <option 
                                        disabled={category.status_name === 'Suspend'}
                                        key={category.id} value={category.id}>{category.title}</option>
                                    ))} 
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* card section */}
                    <div className="pb-20">
                        {threads.length > 0 ? (
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
                                                alt="[object Object]"
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
                                                {thread.reply_count}
                                            </div>
                                        </div>
                                    </CardActionArea>
                                </Card>
                            </Link>
                            ))}
                        </div>
                        ):(
                            <div className=" p-4
                            flex justify-center rounded-md">
                                <p className="text-[#9400D3] font-bold">There is no thread with this keyword.</p>
                            </div>
                        )}
                    </div>

                    {/* post a thread */}
                    <div id="reply-box">
                        <div className="flex gap-2 items-center border-b-2 border-[#9400D3]">
                           <i class="bi bi-pencil-square" id="head-icon"></i>
                            <p id='header-text'>WRITE A THREAD</p>
                        </div>

                        {/* rule board */}
                        <div class="py-2">
                            <div className="card bg-white w-full p-2 border-[#9400D3] border rounded-md">
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
                                                id="title" 
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
                                                value={context} onChange={(e) => setContext(e.target.value)}>

                                                </textarea>
                                            </div>
                                        </div>

                                        {/* file */}

                                        <div className="flex flex-col md:flex-row items-start md:items-center 
                                        gap-2 md:gap-4 py-2"
                                        >
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
export default Search;