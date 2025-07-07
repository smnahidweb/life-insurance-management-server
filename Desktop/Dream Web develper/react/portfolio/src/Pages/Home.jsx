import React from 'react';
import Hero from '../Components/Hero';

import Education from './Education';

import Skills from './Skills';
import Contact from './Contact';
import About from './About';
import ProjectCard from './Projects';
import Projects from './Projects';

const Home = () => {
    return (
        <div className='bg-gradient-to-br from-[#F3F4F6] via-[#E0E7FF] to-white'>
        <div>
           <Hero></Hero>
        </div>

       
        <About></About>
      
        <div>
            <Education></Education>
        </div>
        <div>
            <Skills></Skills>
        </div>
        <div>
           <Projects></Projects>
        </div>
        
        <div>
            <Contact></Contact>
        </div>
        </div>
    );
};

export default Home;