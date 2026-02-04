"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Bike, Scale } from "lucide-react";
type propType = {
  nextStep: (s: number) => void;
};

const Welcome = ({ nextStep }: propType) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-linear-to-b from-green-50 to-white">
      {/* Logo + Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-3 mb-4"
      >
        <Scale className="w-11 h-11 text-green-600" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 tracking-tight">
          Kirana
        </h1>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed"
      >
        Your trusted grocery store for fresh fruits, vegetables, and everyday
        essentials. We bring you quality products at affordable prices, ensuring
        freshness, convenience, and a smooth shopping experience. From daily
        needs to household essentials, everything you need is available in one
        place for a healthier and easier lifestyle.
      </motion.p>

      {/* Icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center gap-6 mt-8 text-green-600"
      >
        <Scale className="w-20 h-20" />
        <Bike className="w-20 h-20 text-orange-500" />
      </motion.div>

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 inline-flex items-center gap-2 px-7 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition"
        onClick={() => nextStep(2)}
      >
        Next
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default Welcome;
