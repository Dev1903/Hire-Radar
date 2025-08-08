import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
    return (
        <div className="grid grid-cols-10 gap-4">
            <div className="col-span-12 sm:col-span-6 p-4 lg:ms-20 flex flex-col justify-center">
                <div className='text-4xl text-glow'>Scan. Match. Win Your Dream Job.
                </div>
                <div className="text-2xl pt-10 text-right text-glow">Faster checks. Smarter matches. Better chances.</div>
                <div className="text-l pt-10 text-center text-glow">
                    HireRadar is your career's secret weapon — combining ATS Resume Checker, Smart Job Search, and AI Resume Maker in one powerful platform.
                </div>
                <div className=" flex justify-center pt-10">
                    <div className=' btn btn-soft btn-warning  w-max text-xl'>
                        <span><Link to="/score-check">Scan Your Resume</Link></span>
                    <i class="fa-solid fa-arrow-right-long pt-1"></i>
                    </div>
                </div>
            </div>
            <div className="col-span-12 sm:col-span-4 p-4 text-glow me-4">
                <img src="/about.png" alt="" className='' />
            </div>
        </div>


    )
}

export default About
