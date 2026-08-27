import Navbar from "../../component/Navbar"
import Footer from "../../component/Footer"
import { Button } from "@mui/material"
import AboutPic from '../../assets/About.jpg'
import AboutBackGround from '../../assets/aboutbg.jpg'
import '../css/About.css'
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DrawIcon from '@mui/icons-material/Draw';

function About(){
    return(
        <>
            <Navbar/>
            <div className="min-h-screen flex flex-col gap-8">
                <div className="min-h-120 bg-[#DE80E9]
                flex p-8 justify-start">
                    <div className="self-center flex-col">
                        <p className="text-[18px] about-text">Hi,</p>
                        <p className="text-[32px] font-bold 
                        my-2 about-text">I'm Tuyen</p>
                        <p className="text-[24px] font-bold my-2
                        about-text">Freelance web developer!</p>
                        <Button id="about-btn">About me</Button>
                    </div>
                </div>
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex justify-center">
                        <img src={AboutPic} className="About-img" alt="mine pic" />
                    </div>
                
                    <div className="flex items-center justify-start">
                        <div className="flex flex-col gap-4 p-8 md:p-4">
                            <p className="text-[24px] underline">About Me</p>
                            <p className="whitespace-pre-line text-[18px]">  
                                Motivated Software Engineer with hands-on experience 
                                in developing full-stack web applications. 
                                Experienced in building responsive websites with WordPress and 
                                Elementor for freelance and commissioned projects. 
                                Strong foundation in software engineering principles, object-oriented programming, 
                                and modern web technologies.
                            </p>
                            <div className="flex-row flex gap-4 justify-center">
                                <Button id="about-email">Talk To Me</Button>
                                <Button id="about-cv">Download CV</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="p-4 flex flex-col gap-4">
                        <div className="flex gap-4 title border-b-2">
                            <FollowTheSignsIcon/><p>Services</p>
                        </div>
                       
                        <ul className="list-none">
                            <li className="flex gap-4"> 
                                <WbSunnyIcon className="text-[#9400D3]"/><p>Programming Languages: C# , Java , JavaScript</p>
                            </li>
                            <li className="flex gap-4"> 
                                <WbSunnyIcon className="text-[#DE80E9]"/><p>Frameworks & Technologies: vue.js, React.js , ASP.NET Core, Node.js and WordPress (Elementor)</p>
                            </li>
                            <li className="flex gap-4"> 
                                <WbSunnyIcon className="text-[#D8BFD8]"/><p>Software Engineering: Lập trình hướng đối tượng (OOP) and các phương pháp kỹ thuật phần mềm</p>
                            </li>
                            <li className="flex gap-4"> 
                                <WbSunnyIcon className="text-white"/><p>PostgreSQL, Microsoft SQL Server và MongoDB</p>
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
                        <div className="box p-8 bg-[#9400D3]">
                            <div className="flex flex-col gap-2">
                                <DrawIcon/>
                                <p>UX Research</p>
                                <p>
                                    UI stands for user interface, which is the point of contact 
                                    and interaction between a human and a device, 
                                    application, or website. It includes everything you see, 
                                    hear, and touch on a screen, such as buttons, icons, text, colors, and layout.
                                </p>
                            </div>
                        </div>
                        <div className="box p-8 bg-[#DE80E9]">
                            <div className="flex flex-col gap-2">
                                <DrawIcon/>
                                <p>UX Research</p>
                                <p>
                                    UI stands for user interface, which is the point of contact 
                                    and interaction between a human and a device, 
                                    application, or website. It includes everything you see, 
                                    hear, and touch on a screen, such as buttons, icons, text, colors, and layout.
                                </p>
                            </div>
                        </div>
                        <div className="box p-8 bg-[#D8BFD8]">
                            <div className="flex flex-col gap-2">
                                <DrawIcon/>
                                <p>UX Research</p>
                                <p>
                                    UI stands for user interface, which is the point of contact 
                                    and interaction between a human and a device, 
                                    application, or website. It includes everything you see, 
                                    hear, and touch on a screen, such as buttons, icons, text, colors, and layout.
                                </p>
                            </div>
                        </div>
                        <div className="box p-8 bg-white">
                            <div className="flex flex-col gap-2">
                                <DrawIcon/>
                                <p>UX Research</p>
                                <p>
                                    UI stands for user interface, which is the point of contact 
                                    and interaction between a human and a device, 
                                    application, or website. It includes everything you see, 
                                    hear, and touch on a screen, such as buttons, icons, text, colors, and layout.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default About