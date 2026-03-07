"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { userProgressManager } from "@/utils/userProgress";
import { useWelcomeModal } from "@/hooks/useWelcomeModal";
import WelcomeModal from "@/components/WelcomeModal";
import WelcomeSequence from "@/components/WelcomeSequence";
import {
  BookOpen,
  Trophy,
  Target,
  Star,
  Award,
  ArrowRight,
  Code,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [progress, setProgress] = useState({
    totalExercises: 0,
    completedExercises: 0,
    totalXP: 0,
    level: 1,
    percentage: 0,
  });

  // Welcome modal hook
  const { showSequence, showWelcome, handleSequenceComplete, closeWelcome } =
    useWelcomeModal();

  useEffect(() => {
    const progressData = userProgressManager.getOverallProgress();
    setProgress(progressData);
  }, []);

  const features = [
    {
      icon: Code,
      title: "Python Learning Interactive",
      description:
        "Menulis dan menjalankan kode Python langsung di browser dengan Monaco Editor",
    },
    {
      icon: BookOpen,
      title: "Materi Terstruktur",
      description:
        "Pembelajaran bertahap dari dasar hingga advanced dengan penjelasan lengkap",
    },
    {
      icon: Target,
      title: "Latihan Praktis",
      description:
        "10+ latihan coding dengan berbagai tingkat kesulitan dan feedback real-time",
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description:
        "Sistem level dan XP untuk memotivasi pembelajaran yang konsisten",
    },
  ];

  const learningPath = [
    {
      step: 1,
      title: "Dasar Python",
      description: "Syntax dasar, variabel, dan operasi matematika",
      topics: ["Hello World", "Variabel", "Tipe Data", "Operasi"],
    },
    {
      step: 2,
      title: "Kontrol Alur",
      description: "Pengkondisian dan perulangan dalam Python",
      topics: ["If-Else", "Loop For", "Loop While", "Break & Continue"],
    },
    {
      step: 3,
      title: "Struktur Data",
      description: "List, tuple, dictionary, dan set",
      topics: ["List", "Dictionary", "Tuple", "Set Operations"],
    },
    {
      step: 4,
      title: "Function & Module",
      description: "Membuat function dan menggunakan module",
      topics: ["Function", "Parameters", "Return", "Import"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                  <span className="hidden sm:inline">
                    Python Learning Interactive
                  </span>
                  <span className="sm:hidden">Python Learning</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">
                  Belajar Python dengan cara yang menyenangkan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <Link href="/materials">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                >
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Mulai </span>Belajar
                </motion.button>
              </Link>

              {progress.totalXP > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Level </span>
                    {progress.level}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    {progress.totalXP}{" "}
                    <span className="hidden xs:inline">XP</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Belajar Python dengan
            <span className="text-indigo-700">
              {" "}
              Interaktif
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Platform pembelajaran Python yang memungkinkan kamu menulis,
            menjalankan, dan mempelajari kode Python langsung di browser tanpa
            instalasi apapun.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/materials">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-md transition-all text-sm sm:text-base"
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                Mulai Pembelajaran
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            </Link>

            <Link href="/history">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all text-sm sm:text-base"
              >
                Lihat Progress
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Progress Overview (if user has started) */}
        {progress.totalXP > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 mb-12 sm:mb-16"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
              Progress Pembelajaran Kamu
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {progress.completedExercises}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Latihan Selesai
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                  {progress.totalXP}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total XP</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {progress.level}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Level Saat Ini
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-xl">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                  {progress.percentage.toFixed(0)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Progress</div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Progress Keseluruhan
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {progress.completedExercises}/{progress.totalExercises}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <motion.div
                  className="bg-indigo-600 h-2 sm:h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Mengapa Pilih Platform Kami?
            </h2>
            <p className="text-sm sm:text-lg text-gray-600">
              Fitur-fitur unggulan yang membuat pembelajaran Python jadi lebih
              efektif
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Jalur Pembelajaran
            </h2>
            <p className="text-sm sm:text-lg text-gray-600">
              Pembelajaran terstruktur dari dasar hingga mahir
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {learningPath.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 relative"
              >
                <div className="absolute -top-2 sm:-top-3 -left-2 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {path.step}
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 mt-1 sm:mt-2">
                  {path.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  {path.description}
                </p>

                <div className="space-y-1 sm:space-y-2">
                  {path.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-500"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      {topic}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan Python Kamu?
          </h2>
          <p className="text-lg mb-8 text-slate-200">
            Bergabunglah dengan ribuan pembelajar lain yang sudah memulai
            perjalanan coding mereka
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/materials">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:shadow-md transition-all"
              >
                Mulai Sekarang - Gratis!
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Welcome Sequence */}
      <WelcomeSequence
        isOpen={showSequence}
        onComplete={handleSequenceComplete}
      />

      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcome} onClose={closeWelcome} />
    </div>
  );
}
