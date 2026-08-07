import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import './SideButton.css'
import React from 'react';
import DrawIcon from '@mui/icons-material/Draw';
import { IconButton } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import { useLocation } from 'react-router';

function SideButton({ targetId = 'reply-section' }){

const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const location = useLocation(); 
const hiddenPages = ['/login', '/register'];
if (hiddenPages.includes(location.pathname)) {
    return null; 
}

const handleScrollToSection = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
};

    return(
        <>
        <div className="fixed bottom-15 right-6 z-50 flex flex-col gap-3">
            <IconButton aria-label="go up" id='side-btn-1' 
            onClick={handleScrollToTop}>
                <KeyboardDoubleArrowUpIcon />
            </IconButton>
           
            <IconButton aria-label="to section" id='side-btn-2'onClick={handleScrollToSection}>
                <DrawIcon />
            </IconButton>
            
            <IconButton aria-label="reload" id='side-btn-3' 
            onClick={() => window.location.reload()}>
                <CachedIcon />
            </IconButton>
        </div>
        </>
    )
}

export default SideButton;