import React, { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          setFormData({ name: "", email: "", message: "" }); // Clear form
        },
        (error) => alert("❌ Something went wrong: " + error.text)
      );
  };

  return (
    <section className=" min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <h2 className="text-white text-3xl font-bold mb-8">Contact</h2>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-[#1a1a80] rounded-2xl shadow-lg overflow-hidden">
        {/* Left Panel: Form or Contact Info */}
        <div className="w-full lg:w-1/2 p-8 space-y-4">
          <div className="flex space-x-4 mb-6">
            <button
              className={`py-2 px-4 rounded font-bold shadow hover:bg-gray-300 transition ${
                activeTab === "send" ? "bg-white text-black" : "bg-gray-400"
              }`}
              onClick={() => setActiveTab("send")}
            >
              SEND MESSAGE
            </button>
            <button
              className={`py-2 px-4 rounded font-bold shadow hover:bg-gray-300 transition ${
                activeTab === "contact" ? "bg-white text-black" : "bg-gray-400"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              CONTACT ME
            </button>
          </div>

          {activeTab === "send" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded bg-white text-black outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Your Mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded bg-white text-black outline-none"
                required
              />
              <textarea
                name="message"
                rows="5"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded bg-white text-black outline-none resize-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-black font-semibold py-3 rounded shadow hover:bg-gray-200 transition"
              >
                Submit
              </button>
            </form>
          ) : (
            <div className="text-white space-y-4 text-lg">
              <p>
                <strong>Phone:</strong> +8801234567890
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:smnahidh040@gmail.com" className="underline text-blue-300">
                  smnahidh040@gmail.com
                </a>
              </p>
              <p>
                <strong>Location:</strong> Dhaka, Bangladesh
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a href="https://linkedin.com/in/yourname" className="underline text-blue-300">
                  linkedin.com/in/yourname
                </a>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <a href="https://github.com/yourname" className="underline text-blue-300">
                  github.com/yourname
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: Video */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-yellow-400">
          <video
            className="w-72 h-72 rounded-full object-cover shadow-xl animate-pulse"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/contact-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Contact;
