import SideButton from "../../component/SideButton";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { Link, useParams } from "react-router";
import { Button,IconButton  } from "@mui/material";
// import {Card, CardActionArea} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import '../css/Thread.css'
//images
import { useEffect, useState } from "react";
import api from "../../auth/ApiHandle";
import { useAuth } from "../../auth/AuthContext";

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

function ThreadRepliesGallery({replies}){
    if(!replies || replies.length == 0)
        return null

    return(
        <>
        {replies.map((reply, index) =>(
        <div className="card p-4 rounded-md">
            {/* thread info */}
            
            <div className="gap-2 thread-info flex justify-start items-center">
                {/* indexing */}
                <div className="index-box gap-2 flex">
                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                    <p>{index+2}</p>
                </div>
                <p>{reply?.name} - {reply?.created_at}</p>
                    {/* thread action */}
                <div className="flex gap-2 p-2">
                    <div className="flex flex-row items-center">
                        <IconButton color="secondary" aria-label="add an alarm">
                            <FavoriteBorderIcon />
                        </IconButton>
                        <p>({reply?.like_count} likes)</p>
                    </div>
                    <Button variant="outlined" id="report-btn">
                        Report
                    </Button>
                </div>
            </div>
            <div className="thread-context">
                <p className="mt-2 mb-8">
                    {reply?.context}
                </p>
            </div>
            <ThreadImagesGallery images={reply?.images}/>

            
            {reply?.parent_reply && (
                <div className="flex gap-1">
                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                    <p>{reply?.parent_reply}</p>
                </div>
            )}

        </div>
        ))}
        </>
    )
}

function Thread(){
    const {id} = useParams()
    const [thread, setThread] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [context, setContext] = useState('');
    const [username, setUsername] = useState('');
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState('');
    const {user} = useAuth()
    

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
            // redirect or reset form on success
        } catch (error) {
            console.log('error thread:', error);
        }
        
    }



    useEffect(()=>{
        async function fetchThreadDetails(){
            try{
                const {data} =  await api.get(`/api/threads/${id}/`)
                setThread(data);
                setLoading(false)
                console.log('data', data);
            } catch(error){
                setError('failed to load thread')
                setLoading(false)
                console.log(error)
            }
        }

        fetchThreadDetails()
    }, [id])

    return(
        <>
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
                                {thread?.category_name}
                            </Button>
                        </Link>                   
                    </div>

                    {/* reply column */}
                    <div className="flex flex-col gap-2 pb-20">

                        {/* thread card      */}
                        <div className="card p-4 rounded-md">

                            {/* thread title */}
                            <div className="thread-title">
                                <p>{thread?.title}</p>
                            </div>

                            {/* thread info */}
                            <div className="gap-2 thread-info flex justify-start items-center">
                                {/* indexing */}
                                <div className="index-box gap-2 flex">
                                    <i className="bi bi-chevron-double-right text-[#9400D3]"></i>
                                    <p>1</p>
                                </div>
                                <p>{thread?.user_username} - {thread?.created_at}</p>
                                 {/* thread action */}
                                <div className="flex gap-2 p-2">
                                    <div className="flex flex-row items-center">
                                        <IconButton color="secondary" aria-label="add an alarm">
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                        <p>({thread?.like_count} likes)</p>
                                    </div>
                                    <Button variant="outlined" id="report-btn">
                                        Report
                                    </Button>
                                </div>
                            </div>


                            <div className="thread-context">
                                <p className="mt-2 mb-8">
                                    {thread?.context}
                                </p>
                                
                            </div>
                            <ThreadImagesGallery images={thread?.images}/>
                        </div>
                        {/* reply card      */}
                        <ThreadRepliesGallery replies={thread?.replies}/>
                           
                    </div>

                    {thread?.status === 1 ? (
                        <div className="pb-10">
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
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-2">
                                                <div className="w-full md:w-24 post-label flex-shrink-0">
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
        </>
    )
}

export default Thread;