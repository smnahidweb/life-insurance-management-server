import React from 'react';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';

const Navbar = () => {

    
    const Links = <>
    
    <li className='text-white'><NavLink to='/'>Home</NavLink></li>
    <li className='text-white'><NavLink to='/about'>About</NavLink></li>
    <li className='text-white'><NavLink to='/education'>Education</NavLink></li>
    <li className='text-white'><NavLink to='/skills'>Skills</NavLink></li>
    <li className='text-white'><NavLink to='/projects'>Project</NavLink></li>
    <li className='text-white'><NavLink to='/contact'>Contact</NavLink></li>

    
    </>
    
   
    return (
        <div className="navbar  shadow-sm mt-2 mx-auto  bg-indigo-500 px-10">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden ">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-indigo-500 rounded-box z-1 mt-3 w-52 p-2 shadow">
       {Links}
      </ul>
    </div>
    <a className=" text-white text-xl">Nahid</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
     {Links}
    </ul>
  </div>
  <div className="navbar-end">
     <motion.a
              href="/resume.pdf" // replace with your actual resume path
              download
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium transition"
            >
              <FaDownload className="mr-2" />
               Download Resume
            </motion.a>
          </div>
  </div>

    );
};

export default Navbar;