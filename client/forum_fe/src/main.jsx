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
import CategoryManager from './view/admin/CategoryManager.jsx';
import User from './view/user/UserPage.jsx';
import History from './view/user/profile/HistoryPage.jsx';
import About from './view/user/AboutPage.jsx'
import Inquiry from './view/user/InquiryPage.jsx';
//
import { AuthProvider } from './auth/AuthContext.jsx';
//
const router = createBrowserRouter([
  //user
  {path:'/', element:<Home/>},
  {path:'/menu', element:<Menu/>},
  {path:'*', element:<NotFound/>},
  {path:'/login', element:<Login/>},
  {path:'/register', element:<Register/>},
  {path:'/threads/:id', element:<Thread/>},
  {path:'/search', element:<Search/>},
  {path:'/profile', element:<Profile/>},
  {path:'/user/:id', element:<User/>},
  {path:'/history', element:<History/>},
  {path:'/about', element:<About/>},
  {path:'/inquiry', element:<Inquiry/>},
  // admin
  {path:'/dashboard', element:<DashBoard/>},
  {path:'/threads', element:<ThreadManager/>},
  {path:'/categories', element:<CategoryManager/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {/* <App /> */}
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
