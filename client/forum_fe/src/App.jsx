import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router'
import Home from './view/user/HomePage'
import DashBoard from './view/admin/DashBoardPage'


function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}>
            <Route index path='dashboard' element={<DashBoard/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
