import React, { useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../components/ThemeLayout"; 

export default function AdminStaff() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let elements = [];
    const images = [];
    const imgSrcs = [
      "https://cdn-icons-png.flaticon.com/512/2232/2232688.png", // Book icon
      "https://cdn-icons-png.flaticon.com/512/2232/2232691.png", // Open book
      "https://cdn-icons-png.flaticon.com/512/2232/2232678.png", // Paper document
    ];

    imgSrcs.forEach((src) => {
      const img = new Image();
      img.src = src;
      images.push(img);
    });

    class FloatingElement {
      constructor(img, x, y, size, speed) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
      }

      draw() {
        ctx.globalAlpha = 0.8;
        ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
        }
        this.draw();
      }
    }

    function init() {
      elements = [];
      for (let i = 0; i < 15; i++) {
        const img = images[Math.floor(Math.random() * images.length)];
        elements.push(
          new FloatingElement(img, Math.random() * canvas.width, Math.random() * canvas.height, 50 + Math.random() * 30, 0.3 + Math.random() * 0.8)
        );
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elements.forEach((element) => element.update());
      requestAnimationFrame(animate);
    }

    setTimeout(() => {
      init();
      animate();
    }, 500);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`relative h-screen w-screen overflow-hidden flex items-center justify-center transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      <canvas ref={canvasRef} className="absolute top-0 left-0" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold"
      >
        <motion.h1
          className="text-5xl mb-8 drop-shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          📚 Staff Management Panel
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          Empowering Educators for a Better Future
        </motion.p>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "📅 Teacher Scheduler", path: "/teacher-scheduler" },
            { name: "📝 Leave Management", path: "/leave-management" },
            { name: "📖 LMS", path: "/lms" },
            { name: "🤖 AI Workload Balancer", path: "/ai-balancer" }
          ].map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleNavigation(item.path)}
              whileTap={{ scale: 1.1, rotate: [0, -3, 3, 0] }} // Shake effect
              whileHover={{ scale: 1.1 }}
              className={`text-xl font-semibold px-8 py-5 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-400 shadow-blue-500/50"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              }`}
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
