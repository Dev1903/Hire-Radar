import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../utils/DarkModeToggleButton';
import Notiflix from 'notiflix';


const Header = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [showArrow, setShowArrow] = useState(localStorage.getItem("showLoginArrow") === "true");

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    useEffect(() => {
        const updateArrow = () => {
            setShowArrow(localStorage.getItem("showLoginArrow") === "true");
        };
        window.addEventListener("storage", updateArrow);
        return () => window.removeEventListener("storage", updateArrow);
    }, []);


    return (
        <div>
            <div className="navbar bg-transparent px-5 sm:px-10 py-4">
                <div className="navbar-start">
                    <div className="dropdown">

                        <label className="btn btn-circle swap swap-rotate lg:hidden me-3" role="button">
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
                            <ul className="menu menu-sm dropdown-content bg-white dark:bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li className='py-1'><Link to="/">Home</Link></li>
                                <li className='py-1'><a>About</a></li>
                                <li className='py-1'>
                                    <a>ATS</a>
                                    <ul className="p-2 w-max">
                                        <li className='py-1'><Link to="/score-check">ATS Score Checker</Link></li>
                                        <li className='py-1'><Link to="/resume-maker">ATS Resume Maker</Link></li>
                                        <li className='py-1'><Link to="/job-search">Resume Based Job Search</Link></li>
                                    </ul>
                                </li>
                                <li className='py-1'><a>Contact Us</a></li>
                            </ul>
                        )}
                    </div>
                    <Link to="/" className="text-xl text-glow">HireRadar</Link>
                </div>

                {/* Computer View Menu */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link to="/">Home</Link></li>
                        <li><a href='/#about'>About</a></li>
                        <li>
                            <details>
                                <summary>ATS</summary>
                                <ul className="p-2 w-max z-100 shadow-xl bg-white dark:bg-base-300">
                                    <li className='dark:hover:backdrop-brightness-100 hover:backdrop-brightness-85 rounded-2xl'><Link to="/score-check">ATS Score Checker</Link></li>
                                    <li className='dark:hover:backdrop-brightness-100 hover:backdrop-brightness-85 rounded-2xl'><Link to="/resume-maker">ATS Resume Maker</Link></li>
                                    <li className='dark:hover:backdrop-brightness-100 hover:backdrop-brightness-85 rounded-2xl'><Link to="/job-search">Resume Based Job Search</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li><a href="/#contact">Contact Us</a></li>
                    </ul>
                </div>

                <div className="navbar-end grid grid-cols-2 gap-4 items-center">
                    {/* Theme Toggle Column */}
                    <div className="col-span-1 flex justify-end items-center">
                        <ThemeToggle />
                    </div>

                    {/* Profile Dropdown Column */}
                    <div className="col-span-1 flex justify-end">
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost h-12 w-12 rounded-full overflow-hidden p-0 border-indigo-500 dark:border-yellow-500 border-2 text-glow"
                                onClick={() => {
                                        // Hide the arrow when profile is clicked
                                        setShowArrow(false);
                                        localStorage.removeItem("showLoginArrow");
                                    }}
                            >
                                <img
                                    src={localStorage.getItem("dp") ? localStorage.getItem("dp") : "/profile.png"}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                    
                                />
                                {showArrow && (
                                    <i
                                        className=" pt-5 fa-solid fa-angle-up fa-xl animate-bounce size-6 text-theme absolute -bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer"
                                    ></i>
                                )}

                            </div>

                            {
                                localStorage.getItem("token") ? (
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-red-300 dark:bg-red-500 dark:text-white rounded-box z-1 mt-3 w-max p-2 shadow absolute right-0 text-md"
                                    >

                                        <li className='dark:hover:backdrop-brightness-100 hover:backdrop-brightness-85 rounded-2xl'>
                                            <a
                                                className="justify-end"
                                                onClick={() => {
                                                    localStorage.removeItem("dp");
                                                    localStorage.removeItem("token");
                                                    Notiflix.Notify.success("Successfully Logged Out! Redirecting.....")
                                                    setTimeout(() => {
                                                        window.location.reload();
                                                    }, 2000)
                                                }
                                                }
                                            >
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-white dark:bg-base-100 rounded-box z-1 mt-3 w-max p-2 shadow absolute right-0 text-md"
                                    >

                                        <li className='dark:hover:backdrop-brightness-100 hover:backdrop-brightness-85 rounded-2xl'>
                                            <a
                                                className="justify-end"
                                                onClick={() =>{
                                                    localStorage.removeItem("showLoginArrow")
                                                    document.getElementById("login_modal").showModal()
                                                }
                                                }
                                            >
                                                Login
                                            </a>
                                        </li>
                                        <li className='dark:hover:backdrop-brightness-100 hover:backdrop-brightness-85 rounded-2xl'>
                                            <a
                                                className="justify-end"
                                                onClick={() =>{
                                                    localStorage.removeItem("showLoginArrow")
                                                    document.getElementById("signup_modal").showModal()
                                                }
                                                }
                                            >
                                                SignUp
                                            </a>
                                        </li>
                                    </ul>
                                )
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Header;
