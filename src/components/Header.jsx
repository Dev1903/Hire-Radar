import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    return (
        <div>
            <div className="navbar bg-transparent px-10 py-4">
                <div className="navbar-start">
                    <div className="dropdown">

                        <label className="btn btn-circle swap swap-rotate lg:hidden" role="button">
                            {/* checkbox controls the state */}
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />

                            {/* hamburger icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="swap-off fill-current h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>

                            {/* close icon */}
                            <svg className="swap-on fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                            </svg>
                        </label>

                        {/* Mobile View Menu (only visible when checked) */}
                        {isChecked && (
                            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><a>Home</a></li>
                                <li><a>About</a></li>
                                <li>
                                    <a>ATS</a>
                                    <ul className="p-2 w-max">
                                        <li><Link to="/score-check">ATS Score Checker</Link></li>
                                        <li><Link to="/resume-maker">ATS Resume Maker</Link></li>
                                        <li><Link to="/job-search">Resume Based Job Search</Link></li>
                                    </ul>
                                </li>
                                <li><a>Contact Us</a></li>
                            </ul>
                        )}
                    </div>
                    <a className="btn btn-ghost text-xl">Hire Radar</a>
                </div>

                {/* Computer View Menu */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><a>Home</a></li>
                        <li><a>About</a></li>
                        <li>
                            <details>
                                <summary>ATS</summary>
                                <ul className="p-2 w-max">
                                    <li><Link to="/score-check">ATS Score Checker</Link></li>
                                    <li><Link to="/resume-maker">ATS Resume Maker</Link></li>
                                    <li><Link to="/job-search">Resume Based Job Search</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li><a>Contact Us</a></li>
                    </ul>
                </div>

                <div className="navbar-end">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost h-12 w-12 rounded-full overflow-hidden p-0 border-yellow-500 border-2">
                            <img src="/profile.png" alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-max p-2 shadow absolute right-0">
                            <li><a className='justify-end'>Login</a></li>
                            <li><a className='justify-end'>Sign Up</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
