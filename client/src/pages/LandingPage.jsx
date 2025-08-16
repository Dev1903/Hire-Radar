import React, { useEffect, useRef } from 'react'
import Header from "../components/Header"
import About from "../section/About"
import ReviewCard from '../components/ReviewCard'
import Reviews from '../section/Reviews'
import ScrollProgress from '../utils/HorizontalScrollbar'
import LoginModal from '../components/auth/LoginModal'
import SignupModal from '../components/auth/SignupModal'
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal'
import Footer from '../section/Footer'
import Notiflix from 'notiflix'

const LandingPage = () => {
  useEffect(() => {
  const name = localStorage.getItem("showAuthSuccess");
  const token = localStorage.getItem("token");
  const logout = localStorage.getItem("showLogoutSuccess");
  
  if (name && token) {
    Notiflix.Notify.success(`Welcome ${name}!`);
    localStorage.removeItem("showAuthSuccess");
    
  }
  if(logout){
    Notiflix.Notify.success("Successfully Logged Out!")
    localStorage.removeItem("showLogoutSuccess"); // remove the flag
  }
}, []);
  return (
    <div >
      <div id="home1"></div>
      <ScrollProgress />
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
      <div className='header sticky top-0 z-50 backdrop-blur-[3px]'>
        <Header />
      </div>

      <div id='about' className="about pt-20">
        <About />
      </div>
      <div  id='reviews' className="reviews pt-50" >
        <Reviews />
      </div>
      <div id='contact' className="footer pt-50">
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
