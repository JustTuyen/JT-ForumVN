import Sidebar from "../../component/Sidebar";
import { useState } from "react";
function DashBoard(){
    const [isOpen, setIsOpen] = useState(true);
    return(
        <>
        <div className="h-screen flex bg-[#F3F5F7]">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div className="flex-1 transition-all duration-300 px-3 h-full overflow-hidden">
                <div className="bg-white border-2 
                rounded-md border-[rgba(0,0,0,0.08)] 
                h-full p-6 shadow-sm flex flex-col">
                    <h1>DASHBOARD</h1>
                </div>
            </div>
        </div>
        </>
    )
}

export default DashBoard;