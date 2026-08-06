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

const router = createBrowserRouter([
  {path:'/', element:<Home/>},
  {path:'/menu', element:<Menu/>},
  {path:'*', element:<NotFound/>}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </StrictMode>,
)
