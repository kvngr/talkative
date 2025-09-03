"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  moveHorizontal,
  moveInCircleReverse,
  moveInCircleSlow,
  moveInCircleLarge,
  moveVertical,
} from "./utils";

type MousePosition = {
  x: number;
  y: number;
};

export const AnimatedBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(40deg, rgb(108, 0, 162), rgb(0, 17, 82))",
        }}
      />

      {/* SVG Filter for goo effect */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gradients container with filter and blur */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          filter: "url(#goo) blur(40px)",
        }}
      >
        {/* Gradient 1 - Vertical movement */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] max-w-[80vh] max-h-[80vh]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0%, rgba(18, 113, 255, 0) 50%)",
            mixBlendMode: "hard-light",
            top: "calc(50% - 40vw)",
            left: "calc(50% - 40vw)",
            transformOrigin: "center center",
          }}
          variants={moveVertical}
          animate="animate"
        />

        {/* Gradient 2 - Circular movement (reverse) */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] max-w-[80vh] max-h-[80vh]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0%, rgba(221, 74, 255, 0) 50%)",
            mixBlendMode: "hard-light",
            top: "calc(50% - 40vw)",
            left: "calc(50% - 40vw)",
            transformOrigin: "calc(50% - 400px)",
          }}
          variants={moveInCircleReverse}
          animate="animate"
        />

        {/* Gradient 3 - Circular movement */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] max-w-[80vh] max-h-[80vh]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0%, rgba(100, 220, 255, 0) 50%)",
            mixBlendMode: "hard-light",
            top: "calc(50% - 40vw + 200px)",
            left: "calc(50% - 40vw - 500px)",
            transformOrigin: "calc(50% + 400px)",
          }}
          variants={moveInCircleSlow}
          animate="animate"
        />

        {/* Gradient 4 - Horizontal movement */}
        <motion.div
          className="absolute w-[80vw] h-[80vw] max-w-[80vh] max-h-[80vh]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(200, 50, 50, 0.8) 0%, rgba(200, 50, 50, 0) 50%)",
            mixBlendMode: "hard-light",
            top: "calc(50% - 40vw)",
            left: "calc(50% - 40vw)",
            transformOrigin: "calc(50% - 200px)",
            opacity: 0.7,
          }}
          variants={moveHorizontal}
          animate="animate"
        />

        {/* Gradient 5 - Large circular movement */}
        <motion.div
          className="absolute"
          style={{
            background:
              "radial-gradient(circle at center, rgba(180, 180, 50, 0.8) 0%, rgba(180, 180, 50, 0) 50%)",
            mixBlendMode: "hard-light",
            width: "calc(80vw * 2)",
            height: "calc(80vw * 2)",
            maxWidth: "calc(80vh * 2)",
            maxHeight: "calc(80vh * 2)",
            top: "calc(50% - 80vw)",
            left: "calc(50% - 80vw)",
            transformOrigin: "calc(50% - 800px) calc(50% + 200px)",
          }}
          variants={moveInCircleLarge}
          animate="animate"
        />

        {/* Interactive bubble that follows mouse */}
        <motion.div
          className="absolute w-full h-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(140, 100, 255, 0.8) 0%, rgba(140, 100, 255, 0) 50%)",
            mixBlendMode: "hard-light",
            opacity: 0.7,
            top: "-50%",
            left: "-50%",
          }}
          animate={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
};
