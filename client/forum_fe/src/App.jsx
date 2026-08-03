import './App.css'
import { Route, Routes } from 'react-router'
import Home from './view/user/HomePage'
import Menu from './view/user/MenuPage'
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route index path='team' element={<Menu/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
