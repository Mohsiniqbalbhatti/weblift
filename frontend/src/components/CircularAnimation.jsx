import React from "react";
import { motion } from "framer-motion";
import html from "../assets/HTML5.png";
import css from "../assets/CSS3.png";
import js from "../assets/JavaScript.png";

const CircularAnimation = () => {
  const logos = [
    { id: 1, name: "HTML", src: html },
    { id: 2, name: "CSS", src: css },
    { id: 3, name: "JS", src: js },
  ];

  const radius = 80; // Radius of the circle
  const center = { x: 100, y: 100 }; // Center of the circle (half of container width/height)

  return (
    <motion.div
      className="circle-container"
      style={{
        position: "relative",
        width: "200px", // Container size
        height: "200px", // Container size
        margin: "0 auto", // Center the container
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Circular Outline */}
      <div
        style={{
          position: "absolute",
          width: `${radius * 2}px`, // Diameter of the circle
          height: `${radius * 2}px`, // Diameter of the circle
          border: "2px solid #fff", // Outline style
          borderRadius: "50%", // Make it a circle
          top: "50%", // Center vertically
          left: "50%", // Center horizontally
          transform: "translate(-50%, -50%)", // Adjust for exact centering
        }}
      />

      {/* Logos */}
      {logos.map((logo, index) => {
        // Calculate angle for each logo
        const angle = index * (360 / logos.length) * (Math.PI / 180); // Convert to radians
        const x = center.x + radius * Math.cos(angle) - 25; // Adjust for logo size
        const y = center.y + radius * Math.sin(angle) - 25; // Adjust for logo size

        return (
          <motion.img
            key={logo.id}
            src={logo.src}
            alt={logo.name}
            className="logo"
            style={{
              position: "absolute",
              width: "50px",
              height: "50px",
              borderRadius: "20%",
              x: x, // Dynamic x position
              y: y, // Dynamic y position
            }}
            animate={{
              rotate: -360, // Counter-rotate to keep logos upright
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </motion.div>
  );
};

export default CircularAnimation;
