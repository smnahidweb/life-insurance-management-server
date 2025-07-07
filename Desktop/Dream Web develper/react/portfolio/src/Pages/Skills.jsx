// src/components/Skills.jsx
import { FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaGithub } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiExpress, SiMongodb, SiFirebase, SiFigma, SiC, SiCplusplus } from 'react-icons/si';
import { GiBrain } from 'react-icons/gi';
import { MdSchool } from 'react-icons/md';

const skills = [
  { name: 'React', icon: <FaReact />, color: 'bg-blue-200 text-blue-700' },
  { name: 'JavaScript', icon: <SiJavascript />, color: 'bg-yellow-100 text-yellow-700' },
  { name: 'HTML5', icon: <FaHtml5 />, color: 'bg-orange-100 text-orange-700' },
  { name: 'CSS3', icon: <FaCss3Alt />, color: 'bg-blue-50 text-blue-600' },
  { name: 'Tailwind', icon: <SiTailwindcss />, color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Node.js', icon: <FaNodeJs />, color: 'bg-green-100 text-green-700' },
  { name: 'Express.js', icon: <SiExpress />, color: 'bg-gray-200 text-gray-800' },
  { name: 'MongoDB', icon: <SiMongodb />, color: 'bg-green-50 text-green-800' },
  { name: 'Firebase', icon: <SiFirebase />, color: 'bg-amber-100 text-amber-700' },
  { name: 'GitHub', icon: <FaGithub />, color: 'bg-gray-100 text-gray-800' },
  { name: 'Figma', icon: <SiFigma />, color: 'bg-pink-100 text-pink-700' },
  { name: 'C', icon: <SiC />, color: 'bg-blue-50 text-blue-700' },
  { name: 'C++', icon: <SiCplusplus />, color: 'bg-indigo-200 text-indigo-700' },
  { name: 'Problem Solving', icon: <GiBrain />, color: 'bg-purple-100 text-purple-700' },
  { name: 'Mentorship', icon: <MdSchool />, color: 'bg-teal-100 text-teal-700' }
];

const Skills = () => {
  return (
    <section id="skills" className="px-6 md:px-20 py-16 ">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#6366F1]">My Skills</h2>
        <p className="text-gray-600 mt-2">Technologies & tools I work with</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${skill.color}`}
          >
            <span className="text-xl">{skill.icon}</span>
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
