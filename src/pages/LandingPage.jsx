import React from 'react'
import Header from "../components/Header"
import About from "../section/About"
import ReviewCard from '../components/ReviewCard'
import Reviews from '../section/Reviews'
const LandingPage = () => {
  return (
    <div >
      <div className='header'>
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
