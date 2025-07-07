// src/components/About.jsx
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaLightbulb } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";
import { MdSportsCricket } from "react-icons/md";
import myPhoto from "/nahid.jpg"; // Replace with your photo

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen  md:px-20  "
    >
      {/* Section Title */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-[#6366F1]">About Me</h2>
        <p className="text-gray-600 mt-2">A brief introduction to who I am and what I do</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Image */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img
            src={myPhoto}
            alt="Nahid Hasan"
            className="w-72 h-72 rounded-2xl object-cover border-8 border-[#6366F1] shadow-lg"
          />
        </motion.div>

        {/* Right Text Content */}
        <motion.div
          className="flex-1 max-w-xl text-gray-800"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="uppercase text-indigo-600 text-sm font-bold tracking-widest mb-2 inline-block">
          
          </span>
          <h2 className="text-4xl font-extrabold text-[#6366F1] mb-6">
            Get to Know Me Better
          </h2>

          <p className="mb-6 text-lg leading-relaxed">
            <FaReact className="inline text-indigo-500 mr-2" />
            I'm a passionate <strong>Full Stack Developer</strong> specializing in the MERN stack. My journey started from pure curiosity and evolved into building modern, scalable, and performant web applications.
          </p>

          <p className="mb-6 text-lg leading-relaxed">
            <FaNodeJs className="inline text-indigo-500 mr-2" />
            I love crafting robust backend systems and integrating them with clean, user-friendly interfaces to deliver a seamless experience.
          </p>

          <p className="mb-6 text-lg leading-relaxed">
            <FaLightbulb className="inline text-indigo-500 mr-2" />
            I have a strong passion for <strong>problem-solving</strong>. Debugging, optimizing logic, and creating efficient algorithms are the challenges I truly enjoy.
          </p>

          <p className="mb-6 text-lg leading-relaxed">
            <MdSportsCricket className="inline text-indigo-500 mr-2" />
            Outside of programming, I enjoy <strong>playing cricket</strong>, watching inspiring tech talks, and exploring design trends — all of which fuel my creativity and problem-solving skills.
          </p>

          <p className="mt-8 text-indigo-600 text-xl font-semibold flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2"><MdSportsCricket /> Cricket Enthusiast</span>
            <span className="flex items-center gap-2"><FaLightbulb /> Problem Solver</span>
            <span className="flex items-center gap-2"><SiMongodb /> Lifelong Learner</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
