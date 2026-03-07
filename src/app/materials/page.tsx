"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { exercises, categories } from "@/data/exercises";
import { materials, materialCategories } from "@/data/index";
import { userProgressManager } from "@/utils/userProgress";
import {
  BookOpen,
  Trophy,
  Target,
  Filter,
  ChevronRight,
  Star,
  Clock,
  ArrowLeft,
  PlayCircle,
  FileText,
  Book,
  CheckCircle,
  Code,
} from "lucide-react";

export default function MaterialsPage() {
  const [activeSection, setActiveSection] = useState<"materials" | "exercises">(
    "materials",
  );
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [progress, setProgress] = useState({
    totalExercises: 0,
    completedExercises: 0,
    totalXP: 0,
    level: 1,
    percentage: 0,
  });
  const [exerciseStatuses, setExerciseStatuses] = useState<
    Record<string, { completed: boolean; attempts: number; score: number }>
  >({});
  const [completedMaterials, setCompletedMaterials] = useState<string[]>([]);

  // Daftar materi yang bisa diakses
  const accessibleMaterials = [
    "programming-history",
    "python-intro",
    "python-basics",
    "variables-datatypes",
  ];

  // Daftar latihan yang bisa diakses
  const accessibleExercises = ["1", "2", "11", "12"]; // Hello World, Variabel, Kalkulator, Biodata

  // Fungsi untuk menangani klik material
  const handleMaterialClick = (materialId: string) => {
    if (accessibleMaterials.includes(materialId)) {
      // Jika materi bisa diakses, buka halaman material
      window.location.href = `/material/${materialId}`;
    }
    // Jika tidak bisa diakses, tidak melakukan apa-apa (button sudah disabled)
  };

  // Fungsi untuk menangani klik exercise
  const handleExerciseClick = (exerciseId: string) => {
    if (accessibleExercises.includes(exerciseId)) {
      // Jika latihan bisa diakses, buka halaman exercise
      window.location.href = `/exercise/${exerciseId}`;
    }
    // Jika tidak bisa diakses, tidak melakukan apa-apa (button sudah disabled)
  };

  useEffect(() => {
    const progressData = userProgressManager.getOverallProgress();
    setProgress(progressData);

    // Get status for each exercise
    const statuses: Record<
      string,
      { completed: boolean; attempts: number; score: number }
    > = {};
    exercises.forEach((exercise) => {
      statuses[exercise.id] = userProgressManager.getExerciseStatus(
        exercise.id,
      );
    });
    setExerciseStatuses(statuses);

    // Load completed materials
    const stored = localStorage.getItem("completedMaterials");
    if (stored) {
      setCompletedMaterials(JSON.parse(stored));
    }
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const categoryMatch =
      selectedCategory === "Semua" || exercise.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === "all" ||
      exercise.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const filteredMaterials = materials.filter((material) => {
    return (
      selectedCategory === "Semua" || material.category === selectedCategory
    );
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Pemula";
      case "intermediate":
        return "Menengah";
      case "advanced":
        return "Lanjutan";
      default:
        return difficulty;
    }
  };

  // Calculate totals for progress display
  const totalCount = exercises.length + materials.length;
  const completedCount =
    progress.completedExercises + completedMaterials.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            {/* Main content row */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden xs:inline">Home</span>
                </motion.button>
              </Link>

              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">
                      Materi Pembelajaran{" "}
                    </span>
                    Python
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">
                  Pelajari teori dan kerjakan latihan interaktif
                </p>
              </div>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              {/* Progress section - more prominent on mobile */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-1 sm:flex-none sm:text-right">
                <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <div className="flex-1 sm:min-w-0">
                  <div className="flex items-center justify-between sm:justify-end gap-2 text-sm text-gray-600">
                    <span className="font-medium">
                      {completedCount}/{totalCount}
                    </span>
                    <span className="text-xs text-gray-500 sm:hidden">
                      Progress
                    </span>
                  </div>
                  <div className="w-full sm:w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(completedCount / totalCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* History button */}
              <Link href="/history">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm text-sm"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden xs:inline">Riwayat</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Progress Belajar
            </h2>
            <span className="text-2xl font-bold text-indigo-600">
              {progress.completedExercises}/{progress.totalExercises}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-indigo-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {progress.totalXP}
              </div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {progress.level}
              </div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {progress.percentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Latihan Selesai</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {completedMaterials.length}/{materials.length}
              </div>
              <div className="text-sm text-gray-600">Materi Selesai</div>
            </div>
          </div>
        </motion.div>

        {/* Section Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6 sm:mb-8 px-4 sm:px-0"
        >
          <div className="bg-gray-100 rounded-2xl p-1.5 sm:p-2 shadow-inner w-full max-w-lg sm:max-w-none sm:w-auto">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveSection("materials")}
                className={`flex-1 sm:flex-none px-3 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base min-w-0 ${
                  activeSection === "materials"
                    ? "bg-indigo-600 text-white shadow-sm transform scale-[1.02] sm:scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <Book className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">
                  <span className="hidden xs:inline">Materi </span>Teori
                </span>
              </button>
              <button
                onClick={() => setActiveSection("exercises")}
                className={`flex-1 sm:flex-none px-3 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base min-w-0 ${
                  activeSection === "exercises"
                    ? "bg-indigo-600 text-white shadow-sm transform scale-[1.02] sm:scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <Code className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">
                  <span className="hidden xs:inline">Latihan </span>Praktik
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-10 mb-8 overflow-hidden relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-slate-50/50"></div>

          {/* Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-sm">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Filter & Pencarian
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {activeSection === "materials"
                    ? "Temukan materi pembelajaran"
                    : "Pilih latihan yang tepat"}
                </p>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <span className="text-sm font-medium text-gray-700">
                {
                  (activeSection === "materials"
                    ? filteredMaterials
                    : filteredExercises
                  ).length
                }{" "}
                item ditemukan
              </span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative z-10 mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <label className="text-base sm:text-lg font-bold text-gray-800">
                  Kategori
                </label>
              </div>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {(activeSection === "materials"
                ? materialCategories
                : categories
              ).map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`group relative px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-out overflow-hidden ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Active Background Animation */}
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="categoryActiveBackground"
                      className="absolute inset-0 bg-indigo-600"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Hover Effect */}
                  <div
                    className={`absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      selectedCategory === category ? "hidden" : ""
                    }`}
                  ></div>

                  <span className="relative z-10 block truncate">
                    {category}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter for Exercises */}
          {activeSection === "exercises" && (
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-base sm:text-lg font-bold text-gray-800">
                    Tingkat Kesulitan
                  </label>
                </div>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  {
                    value: "all",
                    label: "Semua Tingkat",
                    icon: "🎯",
                    color: "from-indigo-600 to-indigo-600",
                    hoverColor: "from-indigo-50 to-indigo-50",
                    description: "Tampilkan semua level",
                  },
                  {
                    value: "beginner",
                    label: "Pemula",
                    icon: "🌱",
                    color: "from-emerald-600 to-emerald-600",
                    hoverColor: "from-emerald-50 to-emerald-50",
                    description: "Dasar & mudah dipahami",
                  },
                  {
                    value: "intermediate",
                    label: "Menengah",
                    icon: "⚡",
                    color: "from-amber-600 to-amber-600",
                    hoverColor: "from-amber-50 to-amber-50",
                    description: "Tantangan sedang",
                  },
                  {
                    value: "advanced",
                    label: "Lanjutan",
                    icon: "🚀",
                    color: "from-rose-600 to-rose-600",
                    hoverColor: "from-rose-50 to-rose-50",
                    description: "Kompleks & menantang",
                  },
                ].map((difficulty, index) => (
                  <motion.button
                    key={difficulty.value}
                    onClick={() => setSelectedDifficulty(difficulty.value)}
                    whileHover={{
                      scale: 1.03,
                      y: -3,
                    }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`group relative px-3 sm:px-4 py-4 sm:py-6 rounded-2xl sm:rounded-3xl text-xs sm:text-sm font-semibold transition-all duration-500 ease-out overflow-hidden ${
                      selectedDifficulty === difficulty.value
                        ? `bg-gradient-to-br ${difficulty.color} text-white shadow-xl border-2 border-white/20`
                        : `bg-white text-gray-700 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl`
                    }`}
                  >
                    {/* Active Background Animation */}
                    {selectedDifficulty === difficulty.value && (
                      <motion.div
                        layoutId="difficultyActiveBackground"
                        className={`absolute inset-0 bg-gradient-to-br ${difficulty.color}`}
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}

                    {/* Hover Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        difficulty.hoverColor
                      } opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                        selectedDifficulty === difficulty.value ? "hidden" : ""
                      }`}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">
                      {/* Icon with Animation */}
                      <motion.div
                        className="text-2xl sm:text-3xl"
                        animate={{
                          scale:
                            selectedDifficulty === difficulty.value
                              ? [1, 1.2, 1]
                              : 1,
                          rotate:
                            selectedDifficulty === difficulty.value
                              ? [0, 10, -10, 0]
                              : 0,
                        }}
                        transition={{
                          duration:
                            selectedDifficulty === difficulty.value ? 0.6 : 0.3,
                          ease: "easeOut",
                        }}
                      >
                        {difficulty.icon}
                      </motion.div>

                      {/* Label */}
                      <div className="text-center">
                        <div className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1">
                          {difficulty.label}
                        </div>
                        <div
                          className={`text-xs opacity-80 leading-tight ${
                            selectedDifficulty === difficulty.value
                              ? "text-white/80"
                              : "text-gray-500"
                          }`}
                        >
                          {difficulty.description}
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                        difficulty.color
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        selectedDifficulty === difficulty.value
                          ? "opacity-100"
                          : ""
                      }`}
                    ></div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1,
          }}
        >
          {activeSection === "materials" ? (
            // Materials Grid
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredMaterials.map((material, index) => {
                const isCompleted = completedMaterials.includes(material.id);
                const isAccessible = accessibleMaterials.includes(material.id);

                return (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{
                      y: isAccessible ? -4 : 0,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`bg-white rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 ease-out overflow-hidden relative ${
                      isCompleted ? "ring-2 ring-green-500 ring-opacity-50" : ""
                    } ${
                      !isAccessible
                        ? "opacity-75 cursor-not-allowed bg-gray-50"
                        : "hover:shadow-2xl cursor-pointer"
                    }`}
                  >
                    {/* Overlay untuk materi yang tidak dapat diakses */}
                    {!isAccessible && (
                      <div className="absolute inset-0 bg-gray-900/10 z-10 flex items-center justify-center">
                        <div className="bg-gray-800/80 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Coming Soon
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isAccessible
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {material.category}
                          </span>
                          {isCompleted && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">
                                Selesai
                              </span>
                            </div>
                          )}
                          {!isAccessible && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-500 font-medium">
                                Segera Hadir
                              </span>
                            </div>
                          )}
                        </div>

                        <h3
                          className={`text-base sm:text-lg font-bold mb-2 line-clamp-2 ${
                            isAccessible ? "text-gray-900" : "text-gray-600"
                          }`}
                        >
                          {material.title}
                        </h3>
                        <p
                          className={`text-sm mb-4 line-clamp-2 ${
                            isAccessible ? "text-gray-600" : "text-gray-500"
                          }`}
                        >
                          {material.description}
                        </p>

                        <div
                          className={`flex flex-wrap items-center gap-3 text-xs mb-4 ${
                            isAccessible ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span className="hidden xs:inline">Materi </span>
                            Teori
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {material.keyPoints.length} Poin
                          </div>
                          {material.relatedExercises.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Code className="h-3 w-3" />
                              {material.relatedExercises.length}{" "}
                              <span className="hidden xs:inline">Latihan</span>
                            </div>
                          )}
                        </div>

                        <motion.button
                          onClick={() => handleMaterialClick(material.id)}
                          whileHover={{ scale: isAccessible ? 1.02 : 1 }}
                          whileTap={{ scale: isAccessible ? 0.98 : 1 }}
                          disabled={!isAccessible}
                          className={`mt-auto w-full px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm ${
                            !isAccessible
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : isCompleted
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          <Book className="h-4 w-4" />
                          <span>
                            {!isAccessible
                              ? "Segera Hadir"
                              : isCompleted
                                ? "Baca Ulang"
                                : "Pelajari"}
                          </span>
                          {isAccessible && <ChevronRight className="h-4 w-4" />}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Exercise List
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredExercises.map((exercise, index) => {
                const status = exerciseStatuses[exercise.id] || {
                  completed: false,
                  attempts: 0,
                  score: 0,
                };
                const isAccessible = accessibleExercises.includes(exercise.id);

                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{
                      y: isAccessible ? -4 : 0,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`bg-white rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 ease-out overflow-hidden relative ${
                      status.completed
                        ? "ring-2 ring-green-500 ring-opacity-50"
                        : ""
                    } ${
                      !isAccessible
                        ? "opacity-75 cursor-not-allowed bg-gray-50"
                        : "hover:shadow-2xl cursor-pointer"
                    }`}
                  >
                    {/* Overlay untuk exercise yang tidak dapat diakses */}
                    {!isAccessible && (
                      <div className="absolute inset-0 bg-gray-900/10 z-10 flex items-center justify-center">
                        <div className="bg-gray-800/80 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Coming Soon
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`text-xs font-medium ${
                              isAccessible ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            #{exercise.id}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isAccessible
                                ? getDifficultyColor(exercise.difficulty)
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {getDifficultyText(exercise.difficulty)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isAccessible
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {exercise.category}
                          </span>
                          {status.completed && isAccessible && (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">
                                Selesai
                              </span>
                            </div>
                          )}
                          {!isAccessible && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-500 font-medium">
                                Segera Hadir
                              </span>
                            </div>
                          )}
                        </div>

                        <h3
                          className={`text-base sm:text-lg font-bold mb-2 line-clamp-2 ${
                            isAccessible ? "text-gray-900" : "text-gray-600"
                          }`}
                        >
                          {exercise.title}
                        </h3>
                        <p
                          className={`text-sm mb-4 line-clamp-2 ${
                            isAccessible ? "text-gray-600" : "text-gray-500"
                          }`}
                        >
                          {exercise.description}
                        </p>

                        <div
                          className={`flex flex-wrap items-center gap-3 text-xs mb-4 ${
                            isAccessible ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {exercise.points} XP
                          </div>
                          {status.attempts > 0 && isAccessible && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="hidden xs:inline">
                                {status.attempts} percobaan
                              </span>
                              <span className="xs:hidden">
                                {status.attempts}x
                              </span>
                            </div>
                          )}
                          {status.completed && isAccessible && (
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-green-500" />
                              {status.score} XP
                            </div>
                          )}
                        </div>

                        <motion.button
                          onClick={() => handleExerciseClick(exercise.id)}
                          whileHover={{ scale: isAccessible ? 1.02 : 1 }}
                          whileTap={{ scale: isAccessible ? 0.98 : 1 }}
                          disabled={!isAccessible}
                          className={`mt-auto w-full px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm ${
                            !isAccessible
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : status.completed
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          <PlayCircle className="h-4 w-4" />
                          <span>
                            {!isAccessible
                              ? "Segera Hadir"
                              : status.completed
                                ? "Ulangi"
                                : "Mulai Latihan"}
                          </span>
                          {isAccessible && <ChevronRight className="h-4 w-4" />}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {((activeSection === "materials" && filteredMaterials.length === 0) ||
          (activeSection === "exercises" &&
            filteredExercises.length === 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-xl mb-2">
              Tidak ada {activeSection === "materials" ? "materi" : "latihan"}{" "}
              yang ditemukan
            </div>
            <div className="text-gray-500">
              Coba ubah filter untuk melihat{" "}
              {activeSection === "materials" ? "materi" : "latihan"} lainnya
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            💡 Tips Belajar Efektif
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>• Baca materi teori terlebih dahulu sebelum latihan</div>
            <div>• Praktikkan setiap konsep dengan menulis kode</div>
            <div>• Gunakan fitur hints jika mengalami kesulitan</div>
            <div>• Ulangi materi dan latihan untuk memperkuat pemahaman</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
