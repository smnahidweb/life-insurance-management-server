import React from 'react';
import Home from '../Pages/Home';
import { createBrowserRouter } from 'react-router';
import HomeLayout from '../Layout/HomeLayout';
import About from '../Pages/About';
import Skills from '../Pages/Skills';

import Contact from '../Pages/Contact';
import Education from '../Pages/Education';
import Projects from '../Pages/Projects';

const Router = createBrowserRouter(

    [
    
        {
            path: '/',
            element: <HomeLayout />, // Main layout (e.g., with Navbar)
            children: [
              { path: '/', element: <Home /> },
              { path: '/about', element: <About /> },
              {path:'/education',element:<Education></Education>},
              { path: '/skills', element: <Skills /> },
              { path: '/projects', element: <Projects /> },
             
              { path: '/contact', element: <Contact /> },
            ],
          },
        ]);
  

export default Router;