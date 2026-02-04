"use client";

import { RootState } from "@/redux/store";

import { Leaf, Smartphone, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      icon: <Leaf className="w-16 h-16 text-green-400" />,
      title: "Fresh Groceries",
      subtitle:
        "Get fresh fruits, vegetables, and daily essentials delivered fast.",
      btnText: "Shop Now",
      bg: "https://plus.unsplash.com/premium_photo-1742902401282-2327a8eccd50",
    },
    {
      id: 2,
      icon: <Truck className="w-16 h-16 text-green-400" />,
      title: "Fast Delivery",
      subtitle: "Doorstep delivery within hours with real-time tracking.",
      btnText: "Track Order",
      bg: "https://images.unsplash.com/photo-1646143542229-8f8b9ad26747?q=80&w=1633&auto=format&fit=crop",
    },
    {
      id: 3,
      icon: <Smartphone className="w-16 h-16 text-green-400" />,
      title: "Easy Payments",
      subtitle: "Pay securely using UPI, cards, or cash on delivery.",
      btnText: "Pay Securely",
      bg: "https://plus.unsplash.com/premium_photo-1740440883568-9297b6366afa?q=80&w=1170&auto=format&fit=crop",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background */}
          <Image
            src={slide.bg}
            alt="slide"
            fill
            priority
            className="object-cover rounded-4xl p-4"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 rounded-4xl m-4" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-20">
            <motion.div
              key={slide.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-xl text-white space-y-5"
            >
              {slide.icon}
              <h1 className="text-3xl sm:text-5xl font-bold">{slide.title}</h1>
              <p className="text-base sm:text-lg text-gray-200">
                {slide.subtitle}
              </p>
              <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-medium transition">
                {slide.btnText}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 🔵 Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="w-3 h-3 rounded-full bg-white/50"
            animate={{
              scale: currentSlide === index ? 1.4 : 1,
              backgroundColor:
                currentSlide === index
                  ? "rgba(34,197,94,1)" // green-500
                  : "rgba(255,255,255,0.5)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
