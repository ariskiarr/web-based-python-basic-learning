"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { exercises } from "@/data/exercises";
import { userProgressManager } from "@/utils/userProgress";
import CodeEditor from "@/components/CodeEditor";
import {
  ArrowLeft,
  BookOpen,
  Target,
  Lightbulb,
  Eye,
  EyeOff,
  Trophy,
  Star,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

interface PyodideWorker {
  runPython: (code: string) => Promise<string>;
  loadPackage: (packages: string[]) => Promise<void>;
}

declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideWorker>;
  }
}

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const exercise = exercises.find((ex) => ex.id === exerciseId);
  const [, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [pyodide, setPyodide] = useState<PyodideWorker | null>(null);
  const [isLoadingPyodide, setIsLoadingPyodide] = useState(true);
  const [exerciseStatus, setExerciseStatus] = useState({
    completed: false,
    attempts: 0,
    score: 0,
  });

  useEffect(() => {
    if (!exercise) {
      router.push("/");
      return;
    }

    setCode(exercise.initialCode);

    // Load exercise status
    const status = userProgressManager.getExerciseStatus(exerciseId);
    setExerciseStatus(status);

    // Load Pyodide
    const initPyodide = async () => {
      try {
        // Load Pyodide script if not already loaded
        if (!window.loadPyodide) {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
          script.onload = async () => {
            const pyodideInstance = await window.loadPyodide();
            setPyodide(pyodideInstance);
            setIsLoadingPyodide(false);
          };
          document.head.appendChild(script);
        } else {
          const pyodideInstance = await window.loadPyodide();
          setPyodide(pyodideInstance);
          setIsLoadingPyodide(false);
        }
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        setIsLoadingPyodide(false);
      }
    };

    initPyodide();
  }, [exercise, exerciseId, router]);

  const runCode = async (userCode: string) => {
    if (!pyodide || isRunning) return;

    setIsRunning(true);
    setOutput("");
    setHasError(false);

    try {
      // Capture stdout
      await pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      // Run user code
      await pyodide.runPython(userCode);

      // Get output
      const stdout = await pyodide.runPython("sys.stdout.getvalue()");
      const stderr = await pyodide.runPython("sys.stderr.getvalue()");

      if (stderr) {
        setOutput(stderr);
        setHasError(true);
      } else {
        setOutput(stdout || "Code executed successfully (no output)");
        setHasError(false);
      }

      // Check if solution is correct (basic check)
      const isCorrect = !stderr && stdout.trim().length > 0;

      // Save attempt
      if (exercise) {
        userProgressManager.addAttempt(
          exercise.id,
          exercise.title,
          userCode,
          stdout || stderr,
          isCorrect,
          exercise.points,
        );

        // Update status
        const newStatus = userProgressManager.getExerciseStatus(exerciseId);
        setExerciseStatus(newStatus);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setOutput(`Error: ${errorMessage}`);
      setHasError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (exercise) {
      setCode(exercise.initialCode);
      setOutput("");
      setHasError(false);
      setShowSolution(false);
    }
  };

  const showNextHint = () => {
    if (exercise && hintIndex < exercise.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

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

  if (!exercise) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Exercise Not Found
          </h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm text-sm sm:text-base"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Kembali</span>
                </motion.button>
              </Link>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0" />
                  <span className="truncate">{exercise.title}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">
                    #{exercise.id}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      exercise.difficulty,
                    )}`}
                  >
                    {getDifficultyText(exercise.difficulty)}
                  </span>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    {exercise.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                  <span className="hidden xs:inline">{exercise.points} XP</span>
                  <span className="xs:hidden">{exercise.points}</span>
                </div>
                {exerciseStatus.completed && (
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-600">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Selesai</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-180px)] sm:min-h-[calc(100vh-200px)]">
          {/* Left Panel - Instructions */}
          <div className="lg:col-span-1 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:overflow-x-hidden scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <div className="space-y-6 lg:pr-3">
              {/* Exercise Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Problem Statement
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {exercise.description}
                    </p>
                  </div>

                  {exercise.expectedOutput && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                          Expected Output
                        </h4>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 border">
                        <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                          {exercise.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Hints */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Hints
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showHints ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span>{showHints ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                </div>

                {showHints && (
                  <div className="p-6">
                    <div className="space-y-4">
                      {exercise.hints
                        .slice(0, hintIndex + 1)
                        .map((hint, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-medium text-yellow-700">
                              {index + 1}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {hint}
                            </p>
                          </motion.div>
                        ))}

                      {hintIndex < exercise.hints.length - 1 && (
                        <button
                          onClick={showNextHint}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <span>Show next hint</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Solution */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Eye className="h-4 w-4 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Solution
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showSolution ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span>{showSolution ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                </div>

                {showSolution && (
                  <div className="p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-900 rounded-lg border overflow-hidden"
                    >
                      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <span className="text-xs text-gray-400 font-medium">
                          Solution Code
                        </span>
                      </div>
                      <pre className="p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                        {exercise.solution}
                      </pre>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Actions & Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Actions
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetCode}
                    className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Code
                  </motion.button>

                  {exerciseStatus.attempts > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Attempts</span>
                          <span className="font-medium text-gray-900">
                            {exerciseStatus.attempts}
                          </span>
                        </div>

                        {exerciseStatus.completed && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-green-800">
                                Completed!
                              </div>
                              <div className="text-xs text-green-600">
                                +{exerciseStatus.score} XP earned
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="lg:col-span-2 h-[500px] sm:h-[600px] lg:h-[calc(100vh-220px)]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              {isLoadingPyodide ? (
                <div className="bg-white rounded-lg shadow-lg h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading Python environment...
                    </p>
                  </div>
                </div>
              ) : (
                <CodeEditor
                  initialCode={exercise.initialCode}
                  onCodeChange={setCode}
                  onRun={runCode}
                  isRunning={isRunning}
                  output={output}
                  hasError={hasError}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
