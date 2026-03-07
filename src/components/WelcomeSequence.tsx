"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface WelcomeSequenceProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function WelcomeSequence({
  isOpen,
  onComplete,
}: WelcomeSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const popups = [
    {
      gif: "/gifs/hai.gif",
      title: "Haaallooo ! 👋",
      message:
        "Selamat datang di web ini! Semoga web ini dapat membantu yah dalam belajar coding 😊",
      buttonText: "Selanjutnya",
    },
    {
      gif: "/gifs/semangat.gif",
      title: "Akhirnya! 🎉",
      message:
        "Akhirnya webnya sudah jadi! Tapi ada beberapa materi yang belum yah, tapi nda apa yang ada dulu yahhh 😅",
      buttonText: "Selanjutnya",
    },
    {
      gif: "/gifs/dada.gif",
      title: "Semangat! 💪",
      message:
        "Semangat yahh belajarnya! 🎓",
      buttonText: "Selesai",
    },
  ];

  const handleNext = () => {
    if (currentStep < popups.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  if (!isOpen) return null;

  const currentPopup = popups[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md w-full p-6 text-center relative overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-slate-50/60" />

            <div className="relative z-10">
              {/* GIF Image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={currentPopup.gif}
                    alt="Animation"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-4"
              >
                {currentPopup.title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6 leading-relaxed"
              >
                {currentPopup.message}
              </motion.p>

              {/* Progress Dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-2 mb-6"
              >
                {popups.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentStep
                        ? "bg-indigo-600"
                        : index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </motion.div>

              {/* Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleNext}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
              >
                {currentPopup.buttonText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
