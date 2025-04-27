import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SchoolHomeAnimation() {
  const canvasRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = [];

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (isDarkMode ? 3 : 2);
        this.speed = Math.random() * (isDarkMode ? 2 : 1);
      }
      draw() {
        ctx.fillStyle = isDarkMode
          ? "rgba(255, 215, 0, 0.8)" 
          : "rgba(150, 180, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
        this.draw();
      }
    }

    function init() {
      stars.length = 0;
      for (let i = 0; i < (isDarkMode ? 100 : 120); i++) {
        stars.push(new Star());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => star.update());
      requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }, [isDarkMode]);

  return (
    <div className={`relative h-screen w-screen overflow-hidden ${isDarkMode ? "bg-black" : "bg-gradient-to-b from-blue-100 via-white to-blue-50"}`}>
      <canvas ref={canvasRef} className="absolute top-0 left-0" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className={`absolute inset-0 flex flex-col items-center justify-center font-bold z-10 ${isDarkMode ? "text-white" : "text-gray-800"}`}
      >
        <motion.h1
          className="text-5xl md:text-6xl mb-4 text-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          School Management System
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl mb-8 text-center"
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          A Nostalgic and Innovative Experience ✨
        </motion.p>

        {/* New features only visible in LIGHT MODE */}
        {!isDarkMode && (
          <div className="flex flex-col items-center gap-6">

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 gap-4">
              {["📚 Manage Students", "🧑‍🏫 Assign Teachers", "🕐 View Timetables", "📝 Track Homework"].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="px-4 py-2 bg-white rounded-xl shadow-md text-blue-600 text-sm font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.2, duration: 0.8 }}
                >
                  {item}
                </motion.div>
              ))}
            </div>

            {/* Inspirational Quote */}
            <div className="max-w-xl text-center text-gray-600 text-base italic">
              "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
            </div>

            {/* Mini Statistics */}
            <div className="flex gap-8 mt-4">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-500">450+</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-green-500">35</div>
                <div className="text-sm text-gray-500">Teachers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-purple-500">12</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
