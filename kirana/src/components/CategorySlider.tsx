"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Apple,
  Coffee,
  Home,
  Baby,
  Package,
  Milk,
  Cookie,
  Wheat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categories = [
  { id: 1, name: "Fruits & Veggies", icon: <Apple /> },
  { id: 2, name: "Beverages", icon: <Coffee /> },
  { id: 3, name: "Bakery & Bread", icon: <Wheat /> },
  { id: 4, name: "Snacks & Chips", icon: <Cookie /> },
  { id: 5, name: "Dairy Products", icon: <Milk /> },
  { id: 6, name: "Baby Essentials", icon: <Baby /> },
  { id: 7, name: "Home & Cleaning", icon: <Home /> },
  { id: 8, name: "Packaged Foods", icon: <Package /> },
];

export default function CategorySlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === "left" ? -380 : 380,
        behavior: "smooth",
      });
    }
  };

  // Auto scroll logic
  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (!sliderRef.current) return;

        const maxScroll =
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

        if (sliderRef.current.scrollLeft >= maxScroll) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: 380, behavior: "smooth" });
        }
      }, 2500);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      if (!sliderRef.current) return;

      const maxScroll =
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

      if (sliderRef.current.scrollLeft >= maxScroll) {
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: 380, behavior: "smooth" });
      }
    }, 2500);
  };

  return (
    <section className="w-full px-10 py-10 bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-end mb-3"
      >
        <div>
          <p className="text-green-600 font-semibold tracking-wide uppercase">
            Explore Store
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-1">
            Shop From Categories
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full bg-white shadow-md hover:bg-green-600 hover:text-white transition"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full bg-white shadow-md hover:bg-green-600 hover:text-white transition"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      </motion.div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex gap-10 overflow-x-auto scroll-smooth snap-x snap-mandatory py-6 no-scrollbar"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{
              scale: 1.12,
              rotateX: 8,
              rotateY: -6,
            }}
            whileTap={{ scale: 0.96 }}
            className="snap-center min-w-[280px] h-[280px] bg-white/90 backdrop-blur-xl rounded-3xl p-10 flex flex-col justify-center items-center shadow-xl hover:shadow-2xl border border-green-100 transition-all cursor-pointer relative overflow-hidden group"
          >
            {/* Glow background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-green-200 via-emerald-200 to-lime-200 blur-3xl" />

            {/* Icon */}
            <div className="relative z-10 text-green-600 mb-6 group-hover:scale-125 transition">
              {React.cloneElement(cat.icon, { size: 64 })}
            </div>

            {/* Title */}
            <h3 className="relative z-10 text-xl font-bold text-gray-900 text-center">
              {cat.name}
            </h3>

            {/* CTA */}
            <p className="relative z-10 text-sm text-gray-500 mt-3 group-hover:text-green-600 transition">
              Explore Now →
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
