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
const router = createBrowserRouter([
  {path:'/', element:<Home/>},
  {path:'/menu', element:<Menu/>},
  {path:'*', element:<NotFound/>},
  {path:'/login', element:<Login/>},
  {path:'/register', element:<Register/>},
  {path:'/thread', element:<Thread/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </StrictMode>,
)
