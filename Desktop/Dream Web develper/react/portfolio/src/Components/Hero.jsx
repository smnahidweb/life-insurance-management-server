// src/components/Hero.jsx
import { FaGithub, FaLinkedin, FaFacebook, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import myPhoto from '/nahid.jpg'; // Replace with your image path

const nameWords = ['S.M.', 'Nahid', 'Hasan'];

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 ">
      {/* Left Section */}
      <div className="flex-1 text-center md:text-left space-y-6">
        {/* Animated Name Word by Word */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#6366F1] flex gap-2 flex-wrap justify-center md:justify-start">
          {nameWords.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.5, duration: 0.5 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Designation */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-xl text-gray-700"
        >
Full Stack Developer skilled in MERN stack, building scalable apps with clean UI and robust backend.
        </motion.h2>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="flex gap-5 justify-center md:justify-start text-2xl text-[#6366F1]"
        >
          <a href="https://github.com/YOUR_USERNAME" target="_blank" rel="noreferrer"><FaGithub /></a>
          <a href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="https://facebook.com/YOUR_FACEBOOK" target="_blank" rel="noreferrer"><FaFacebook /></a>
        </motion.div>

        {/* Resume Button */}
        <motion.a
          href="/resume.pdf" // replace with your actual resume path
          download
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="inline-flex items-center px-6 py-3 bg-[#6366F1] text-white rounded-full font-medium hover:bg-indigo-600 transition"
        >
          <FaDownload className="mr-2" />
          Download Resume
        </motion.a>
      </div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5 }}
        className="flex-1 mt-10 md:mt-0 flex justify-center"
      >
        <img
          src={myPhoto}
          alt="Nahid Hasan"
          className="w-72 h-72 rounded-full object-cover border-4 border-[#6366F1] shadow-lg"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
