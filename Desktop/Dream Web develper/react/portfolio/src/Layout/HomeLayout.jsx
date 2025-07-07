import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';
import Hero from '../Components/Hero';

const HomeLayout = () => {
    return (
        <div>
           <div>
           <Navbar></Navbar>
           </div>
          
           <div className='min-h-screen'>
            <Outlet>

            </Outlet>
           </div>
           <div>

           <Footer></Footer>
           </div>
        </div>
    );
};

export default HomeLayout;