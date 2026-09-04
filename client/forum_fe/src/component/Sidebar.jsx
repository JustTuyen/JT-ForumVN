import HouseIcon from '@mui/icons-material/House';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AreaChartIcon from '@mui/icons-material/AreaChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import ListIcon from '@mui/icons-material/List';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import CloseIcon from '@mui/icons-material/Close';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { NavLink } from 'react-router';
const Sidebar = ({ isOpen, setIsOpen }) => {
    
const [activeDropdown, setActiveDropdown] = useState('');

const navItems = [
    { 
        title: 'Home', 
        icon: HouseIcon, 
        hasDropdown: false,
        path: '/dashboard'
    },
    { 
      title: 'Thread', 
      icon: CollectionsBookmarkIcon,
      hasDropdown: true,
      dropdownItems: [
            {label:'Category Manager', path: '/dashboard/category'}, 
            {label:'Thread Manager', path: '/dashboard/thread'}
        ]
    },

    { 
      title: 'User', 
      icon: PeopleAltIcon,
      hasDropdown: true,
      dropdownItems: [
        {label: 'User Manager', path: '/dashboard/user'},
        {label: 'Moderator Manager', path: '/dashboard/moderator'}
      ]
    },
    { 
      title: 'Subscription', 
      icon: AddReactionIcon,
      hasDropdown: true,
      dropdownItems: [
        {label: 'Rank Manager', path: '/dashboard/rank'},
        {label: 'Plan Manager', path: '/dashboard/plan'}
      ]
    },
    { 
      title: 'Messages', 
      icon: QuestionAnswerIcon,
      hasDropdown: true,
      dropdownItems: [
        {label: 'Inbox', path: '/dashboard/inbox'},
        {label: 'Sent', path: '/dashboard/sent'},
        {label: 'Drafts', path: '/dashboard/drafts'},
        {label: 'Archived', path: '/dashboard/archived'}
      ]
    },
    { 
        title: 'Analytics', 
        icon: AreaChartIcon, 
        hasDropdown: false },
    {
      title: 'Settings',
      icon: SettingsIcon,
      hasDropdown: true,
      dropdownItems: [
        {label: 'Status Manager', path: '/dashboard/status'},
        {label: 'Security', path: '/dashboard/security'},
        {label: 'Notifications', path: '/dashboard/notifications'}
      ]
    }
];

return (
    <div 
      className={`bg-[#9400D3] text-white transition-all 
        duration-300 ease-in-out text-sm border-2 
        rounded-md border-[rgba(0,0,0,0.08)]
        ${isOpen ? 'w-64' : 'w-16'}`}
    >

        {/* dashboard and x-close btn */}
        <div className="p-4 flex justify-between items-center">
            <h1 className={`font-bold overflow-hidden transition-all 
            duration-300 text-lg text-nowrap text-white
            ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            Dashboard
            </h1>
            <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-[#DE80E9] p-2 rounded-lg"
            >
            {isOpen ? <CloseIcon size={20} strokeWidth={1.5} /> : 
            <ListIcon size={20} strokeWidth={1.5} />}
            </button>
        </div>

        {/* dashboard items */}
        <nav className="mt-6">
        {navItems.map((item) => (
            <div key={item.title}>
                <div 
                className="px-4 py-3 hover:opacity-85 hover:bg-[#DE80E9]
                cursor-pointer flex items-center justify-between"
                onClick={() => item.hasDropdown && isOpen && setActiveDropdown(activeDropdown === item.title ? '' : item.title)}
                >
                    <div className="flex items-center">
                        <item.icon size={20} strokeWidth={1.5} color='#000' />
                        <span className={`ml-4 whitespace-nowrap overflow-hidden 
                        transition-all duration-300
                        ${isOpen ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
                        {item.title}
                        </span>
                    </div>
                    {item.hasDropdown && isOpen && (
                        <KeyboardDoubleArrowDownIcon 
                        size={16} 
                        strokeWidth={1.5}
                        className={`transition-transform duration-200 
                            ${activeDropdown === item.title ? 'rotate-180' : ''}`}
                        />
                    )}
                </div>
            
                {item.hasDropdown && isOpen && activeDropdown === item.title && (
                    <div className="bg-[#DE80E9] overflow-hidden transition-all duration-200">
                    {item.dropdownItems.map((dropdownItem) => (
                        <NavLink
                            key={dropdownItem.path}
                            to={dropdownItem.path}
                            className={({ isActive }) =>
                                `block px-11 py-2 hover:bg-[#f1f1f1] cursor-pointer text-sm ${isActive ? 'bg-[#f1f1f1] font-semibold' : ''}`
                            }
                        >
                            {dropdownItem.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
        ))}
        </nav>
    </div>
  );
};

export default Sidebar