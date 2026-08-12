import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//css and UI framework
import '@fontsource/poppins';//icons
import 'bootstrap-icons/font/bootstrap-icons.css'

//routing
import { createBrowserRouter, RouterProvider } from 'react-router'
import Menu from './view/user/MenuPage.jsx'
import NotFound from './view/user/NotFountPage.jsx'
import Home from './view/user/HomePage.jsx'
import Login from './view/user/LoginPage.jsx';
import Register from './view/user/RegisterPage.jsx';
import Thread from './view/user/ThreadPage.jsx'
import Search from './view/user/SearchPage.jsx';
import Profile from './view/user/profile/ProfilePage.jsx'
import DashBoard from './view/admin/DashBoardPage.jsx';
import ThreadManager from './view/admin/ThreadManager.jsx';
import User from './view/user/UserPage.jsx';
import AboutUs from './view/user/AboutPage.jsx';
const router = createBrowserRouter([
  //user
  {path:'/', element:<Home/>},
  {path:'/menu', element:<Menu/>},
  {path:'*', element:<NotFound/>},
  {path:'/login', element:<Login/>},
  {path:'/register', element:<Register/>},
  {path:'/thread', element:<Thread/>},
  {path:'/search', element:<Search/>},
  {path:'/profile', element:<Profile/>},
  {path:'/user', element:<User/>},
  {path:'/about', element:<AboutUs/>},
  // admin
  {path:'/dashboard', element:<DashBoard/>},
  {path:'/dashboard/thread', element:<ThreadManager/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </StrictMode>,
)
