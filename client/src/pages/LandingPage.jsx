import React from 'react'
import Header from "../components/Header"
import About from "../section/About"
import ReviewCard from '../components/ReviewCard'
import Reviews from '../section/Reviews'
import ScrollProgress from '../utils/HorizontalScrollbar'
import LoginModal from '../components/auth/LoginModal'
import SignupModal from '../components/auth/SignupModal'
const LandingPage = () => {
  return (
    <div >
      <ScrollProgress />
      <LoginModal />
      <SignupModal />
      <div className='header sticky top-0 z-50 backdrop-blur-[3px]'>
        <Header />
      </div>
      <div className="about pt-20">
        <About />
      </div>
      <div className="reviews pt-50">
        <Reviews />
      </div>
    </div>
  )
}

export default LandingPage
