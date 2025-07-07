import React, { useState } from "react";

const educationData = {
  SSC: {
    institute: "Bilkarilla B.M. High School",
    group: "Science",
    result: "5.00 out of 5.00",
    year: "2018",
    activities:
      "Received honors for academic excellence. Engaged in internships with industry-leading companies, gaining hands-on experience in the field of science and technology.",
    video: "", // replace with your video
  },
  HSC: {
    institute: "Rajshahi Cantonment Board School & College",
    group: "Science",
    result: "5.00 out of 5.00",
    year: "2020",
    activities:
      "Participated in science fairs and seminars. Completed coursework with distinction and actively volunteered in tech clubs.",
    video: "",
  },
  Graduation: {
    institute: "International University of Business Agriculture and Technology",
    group: "Computer Science & Engineering",
    result: "3.73 out of 4.00",
    year: '4th (Running)',
    activities:
      "Worked on real-life projects, contributed to open-source, and served as a Academy Mentor for junior students.",
    video: "",
  },
};

export default function Education() {
  const [selectedTab, setSelectedTab] = useState("SSC");
  const current = educationData[selectedTab];

  return (
    <section id="education" className="  py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold  text-indigo-600 text-center mb-10">
          Education Background
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-4">
          {["SSC", "HSC", "Graduation"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-md font-semibold transition cursor-pointer ${
                selectedTab === tab
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded font-semibold transition "
                  : "bg-gray-500 text-white hover:bg-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Card Section */}
        <div className="bg-gradient-to-br from-[#F3F4F6] via-[#E0E7FF] to-white rounded-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left: Info */}
          <div className="p-8 z-10 relative">
            <p className="text-indigo-600">
              <strong>Institute:</strong> {current.institute}
            </p>
            <p>
              <strong>Department/Group:</strong> {current.group}
            </p>
            <p>
              <strong>Result:</strong> {current.result}
            </p>
            <p>
              <strong>Passing Year:</strong> {current.year}
            </p>
            <p className="mt-4">
              <strong>Activities:</strong> {current.activities}
            </p>
          </div>

          {/* Right: Background Video */}
          <div className="relative h-64 md:h-auto">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              src='/edu.mp4'
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 " />
          </div>
        </div>
      </div>
    </section>
  );
}
