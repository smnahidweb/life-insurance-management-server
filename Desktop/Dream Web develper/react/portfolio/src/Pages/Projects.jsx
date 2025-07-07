import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import plantImg from '/plant3.png';  // Replace with your actual image paths
import jobImg from '/lawer.png';
import tourImg from '/tour.png';

const projects = [
  {
    title: "Tree Plant Store",
    description: "A full-stack e-commerce web app for selling and managing plants.",
    image: plantImg,
    features: [
      "User authentication & role-based dashboard",
      "Add to cart, wishlist, and secure payments",
      "Admin panel with analytics"
    ],
    technologies: [
      { name: "React", color: "bg-blue-100 text-blue-700" },
      { name: "Tailwind", color: "bg-cyan-100 text-cyan-700" },
      { name: "Node.js", color: "bg-green-100 text-green-700" },
      { name: "MongoDB", color: "bg-green-50 text-green-800" },
      { name: "Firebase", color: "bg-amber-100 text-amber-700" },
        { name: "Express.js", color: "bg-gray-200 text-gray-800" },
    ],
    live: "https://tree-plant-store.web.app",
    client: "https://github.com/smnahidweb/tree-plant-store-client",
    server: "https://github.com/smnahidweb/tree-plant-store-server",
    details: "#"
  },
 
  {
    title: "TourNest - Booking Site",
    description: "A modern tour booking platform with user dashboards and package management.",
    image: tourImg,
    features: [
      "Public, user & admin views",
      "Add/manage tour packages",
      "Booking system with payment integration"
    ],
    technologies: [
      { name: "React", color: "bg-blue-100 text-blue-700" },
      { name: "Tailwind", color: "bg-cyan-100 text-cyan-700" },
      { name: "Firebase", color: "bg-amber-100 text-amber-700" },
      { name: "JWT", color: "bg-yellow-100 text-yellow-800" },
      { name: "MongoDB", color: "bg-green-50 text-green-800" },
      { name: "Express.js", color: "bg-gray-200 text-gray-800" }
    ],
    live: "https://tour-booking-system-fa219.web.app/",
    client: "https://github.com/smnahidweb/tour-managesment-systems",
    server: "https://github.com/smnahidweb/tour-management-systems-server",
    details: "#"
  },
   {
  title: "Lawyer.BD",
  description: "A dynamic legal service platform where users can book, cancel appointments, make payments, and explore a list of lawyers.",
  image: jobImg, // You can replace with a lawyer-specific image
  features: [
    "User can browse and view all lawyers",
    "Booking and canceling appointments",
    "Secure payment integration",
    "Authentication and user dashboard"
  ],
  technologies: [
    { name: "React", color: "bg-blue-100 text-blue-700" },
    { name: "Tailwind", color: "bg-cyan-100 text-cyan-700" },
    { name: "Firebase", color: "bg-amber-100 text-amber-700" },

    { name: "MongoDB", color: "bg-green-50 text-green-800" }
  ],
  live: "https://curious-torrone-3e4c10.netlify.app/",
  client: "https://github.com/smnahidweb/lawyer-farm",
  server: "https://github.com/smnahidweb/lawyer-farm",
  details: "#"
}

];

const Projects = () => {
  return (
    <section id="projects" className="px-6 md:px-20 py-20 ">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#6366F1]">My Projects</h2>
        <p className="text-gray-600 mt-2">Some of my recent work</p>
      </div>

      {/* Outer Grid - always 1 column to show 1 card per row */}
      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            // Card grid: 2 columns - image left, info right
            className="rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-[1.5fr_2fr] gap-6"
          >
            {/* Left Image */}
            <div className="h-full">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-[400px] object-cover rounded-l-3xl"
              />
            </div>

            {/* Right Content */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#6366F1] mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-4 text-sm">{project.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Key Features:</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {project.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full font-medium ${tech.color}`}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 ">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-[#6366F1] text-white px-4  rounded-md hover:bg-indigo-700 transition"
                >
                  <FaExternalLinkAlt /> Live
                </a>
                <a
                  href={project.client}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
                >
                  <FaGithub /> Client
                </a>
                {project.server && (
                  <a
                    href={project.server}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    <FaGithub /> Server
                  </a>
                )}
                {project.details && (
                  <a
                    href={project.details}
                   className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    View Details
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
