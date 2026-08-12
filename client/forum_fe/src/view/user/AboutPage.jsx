import {ToastContainer, toast} from 'react-toastify'
import Navbar from "../../component/Navbar"
import Footer from "../../component/Footer"
function AboutUs(){
    const notify = () => toast('wow!')
    return(
        <>
        <Navbar/>
        <div className="min-h-screen">
            <p>This is about us</p>
            <button onClick={notify}>Notify</button>
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    )
}

export default AboutUs