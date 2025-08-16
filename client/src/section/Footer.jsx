import React from 'react'

const Footer = () => {
    return (
        <footer className=" text-gray-300 w-full">
            {/* Top Footer */}
            <div className="py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap- w-full sm:text-center ps-5 sm:ms-0">

                {/* Column 1: Brand & Social */}
                <div className='mb-15'>
                    <h2 className="text-xl font-bold mb-4 text-indigo-600 dark:text-white">HireRadar</h2>
                    <p className="text-gray-400 mb-4 text-glow break-words">
                        Making the web a better place with modern solutions.
                    </p>
                    <div className="flex space-x-18 justify-center text-2xl text-theme">
                        <a href="https://github.com/Dev1903" className="hover:text-indigo-400 dark:hover:text-white" aria-label="GitHub" target="_blank">
                            <i class="fa-brands fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/sneha-jana-504ab0282/" className=" hover:text-indigo-400 dark:hover:text-white" aria-label="Linkedin" target='_blank'>
                            <i class="fa-brands fa-linkedin"></i>
                        </a>
                        <a href="https://www.instagram.com/___debanjan.pan__/" className="hover:text-indigo-400 dark:hover:text-white" aria-label="Instagram" target='_blank'>
                            <i class="fa-brands fa-instagram"></i>
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className='mb-15'>
                    <h2 className="text-xl font-bold mb-4 text-indigo-600 dark:text-white">Quick Links</h2>
                    <ul className="space-y-2">
                        <li className="text-glow"><a
                            href="#home1"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("home1")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Home
                        </a></li>
                        <li className="text-glow"><a
                            href="#about"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            About
                        </a></li>
                        <li className="text-glow"><a
                            href="#reviews"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Customer Reviews
                        </a></li>
                        <li className="text-glow"><a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Contact Us
                        </a></li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-white mb-4">Contact Us</h2>
                    <ul className="space-y-2">
                        <li><span className='text-theme'>Email:</span> <a href="mailto:contact@hireradar.com" className='text-glow'>contact@hireradar.com</a></li>
                        <li><span className='text-theme'>Phone:</span> <a href="tel:+123 456 789" className='text-glow'>+123 456 789</a></li>
                        <li><span className='text-theme'>Address:</span> <a href="https://maps.app.goo.gl/T1suMdCFzcaLmLHd9" className='text-glow'>123 Auj-para-gaon, Kolkata, India</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-sm w-full">
                © {new Date().getFullYear()} MyCompany. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
