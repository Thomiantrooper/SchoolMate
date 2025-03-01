import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SchoolHomeAnimation() {
  const canvasRef = useRef(null);

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
        this.size = Math.random() * 3;
        this.speed = Math.random() * 2;
      }
      draw() {
        ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
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
      for (let i = 0; i < 100; i++) {
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
    });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold"
      >
        <motion.h1
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          School Management System
        </motion.h1>
        <motion.p
          className="text-xl"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          A Nostalgic and Innovative Experience
        </motion.p>
      </motion.div>
    </div>
  );
}
