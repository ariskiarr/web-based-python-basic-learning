"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Book,
  CheckCircle,
  Target,
  Clock,
  BookOpen,
  Code,
  Trophy,
  Menu,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { materials, LearningMaterial } from "@/data/index";
import { exercises } from "@/data/exercises";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-900 rounded-lg p-4 text-green-400 text-sm font-mono">
      Loading editor...
    </div>
  ),
});

export default function MaterialPage() {
  const params = useParams();
  const router = useRouter();
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [completedMaterials, setCompletedMaterials] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundMaterial = materials.find((m) => m.id === params.id);
      setMaterial(foundMaterial || null);

      // Load completed materials from localStorage
      const stored = localStorage.getItem("completedMaterials");
      if (stored) {
        setCompletedMaterials(JSON.parse(stored));
      }
    }
  }, [params.id]);

  const markAsCompleted = () => {
    if (!material) return;

    const updated = [...completedMaterials, material.id];
    setCompletedMaterials(updated);
    localStorage.setItem("completedMaterials", JSON.stringify(updated));
  };

  const isCompleted = material
    ? completedMaterials.includes(material.id)
    : false;

  // Get related exercises
  const relatedExercises = material
    ? exercises.filter((exercise) =>
        material.relatedExercises.includes(exercise.id),
      )
    : [];

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Book className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Material Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The material you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/materials")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  const formatTextWithMarkdown = (text: string) => {
    // Simple approach: find and replace patterns one by one
    const processText = (
      inputText: string,
    ): (string | React.ReactElement)[] => {
      const result: (string | React.ReactElement)[] = [];
      let remaining = inputText;
      let elementKey = 0;

      while (remaining.length > 0) {
        // Look for **bold** pattern (non-greedy)
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        if (boldMatch && boldMatch.index !== undefined) {
          // Add text before the match
          if (boldMatch.index > 0) {
            result.push(remaining.substring(0, boldMatch.index));
          }

          // Add bold element
          result.push(
            <strong
              key={`bold-${elementKey++}`}
              className="font-bold text-gray-900"
            >
              {boldMatch[1]}
            </strong>,
          );

          // Continue with remaining text
          remaining = remaining.substring(
            boldMatch.index + boldMatch[0].length,
          );
          continue;
        }

        // Look for `code` pattern
        const codeMatch = remaining.match(/`(.+?)`/);
        if (codeMatch && codeMatch.index !== undefined) {
          // Add text before the match
          if (codeMatch.index > 0) {
            result.push(remaining.substring(0, codeMatch.index));
          }

          // Add code element
          result.push(
            <code
              key={`code-${elementKey++}`}
              className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
            >
              {codeMatch[1]}
            </code>,
          );

          // Continue with remaining text
          remaining = remaining.substring(
            codeMatch.index + codeMatch[0].length,
          );
          continue;
        }

        // No more patterns found, add remaining text
        result.push(remaining);
        break;
      }

      return result;
    };

    return processText(text);
  };

  // Function to calculate dynamic height based on number of lines
  const calculateEditorHeight = (content: string) => {
    const lines = content.split("\n").length;
    const lineHeight = 20; // approximate line height in pixels
    const padding = 32; // top and bottom padding
    const minHeight = 60; // minimum height
    const maxHeight = 400; // maximum heights to prevent too tall editors

    const calculatedHeight = Math.max(
      minHeight,
      Math.min(maxHeight, lines * lineHeight + padding),
    );
    return calculatedHeight;
  };

  const formatContent = (content: string) => {
    const lines = content.split("\n");
    const result = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Handle code blocks
      if (line.startsWith("```")) {
        const language = line.slice(3).trim() || "python";
        const codeLines = [];
        i++; // Skip the opening ```

        // Collect code lines until closing ```
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }

        const codeContent = codeLines.join("\n");
        const editorHeight = calculateEditorHeight(codeContent);

        result.push(
          <div key={`code-${i}`} className="my-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 font-medium">
                {language === "python" ? "Python Code" : language.toUpperCase()}
              </div>
              <div className="px-4" style={{ height: `${editorHeight}px` }}>
                <MonacoEditor
                  height="100%"
                  language={language}
                  value={codeContent}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: "off",
                    folding: false,
                    glyphMargin: false,
                    lineDecorationsWidth: 0,
                    padding: { top: 16, bottom: 16 },
                    overviewRulerBorder: false,
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                  }}
                />
              </div>
            </div>
          </div>,
        );
        i++; // Skip the closing ```
        continue;
      }

      // Handle headers
      if (line.startsWith("# ")) {
        result.push(
          <h1
            key={i}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8 first:mt-0"
          >
            {formatTextWithMarkdown(line.slice(2))}
          </h1>,
        );
      } else if (line.startsWith("## ")) {
        result.push(
          <h2
            key={i}
            className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 mt-5 sm:mt-6"
          >
            {formatTextWithMarkdown(line.slice(3))}
          </h2>,
        );
      } else if (line.startsWith("### ")) {
        result.push(
          <h3
            key={i}
            className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 mt-4 sm:mt-5"
          >
            {formatTextWithMarkdown(line.slice(4))}
          </h3>,
        );
      } else if (line.startsWith("- ")) {
        // Handle bullet points
        result.push(
          <li
            key={i}
            className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2 ml-4 list-disc"
          >
            {formatTextWithMarkdown(line.slice(2))}
          </li>,
        );
      } else if (/^\d+\./.test(line.trim())) {
        // Handle numbered lists
        result.push(
          <li
            key={i}
            className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2 ml-4 list-decimal"
          >
            {formatTextWithMarkdown(line.replace(/^\d+\.\s*/, ""))}
          </li>,
        );
      } else if (line.trim().startsWith("<img")) {
        // Handle img tags
        const imgMatch = line.match(
          /<img\s+src="([^"]+)"\s+alt="([^"]*)"[^>]*>/,
        );
        if (imgMatch) {
          result.push(
            <div key={i} className="my-6 text-center">
              <Image
                src={imgMatch[1]}
                alt={imgMatch[2]}
                width={600}
                height={400}
                className="max-w-full h-auto mx-auto rounded-lg shadow-md"
              />
            </div>,
          );
        }
      } else if (line.trim()) {
        // Regular paragraphs
        result.push(
          <p
            key={i}
            className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4"
          >
            {formatTextWithMarkdown(line)}
          </p>,
        );
      } else {
        // Empty lines
        result.push(<br key={i} />);
      }

      i++;
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={() => router.push("/materials")}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="hidden sm:block w-px h-6 bg-gray-300" />

              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                  {material.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate hidden xs:block">
                  {material.category}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Progress indicator */}
              <div className="hidden md:flex items-center space-x-2">
                {isCompleted ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm">In Progress</span>
                  </div>
                )}
              </div>

              {/* Mobile progress indicator */}
              <div className="md:hidden">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0">
        {/* Sidebar */}
        {(isSidebarOpen ||
          (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed lg:sticky top-14 sm:top-16 left-0 w-full sm:w-96 lg:w-80 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-white lg:border-r border-gray-200 z-30 overflow-y-auto shadow-xl lg:shadow-none"
          >
            <div className="h-full flex flex-col">
              {/* Mobile header */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Detail Materi
                    </h2>
                    <p className="text-sm text-gray-500">{material.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-6 space-y-6">
                  {/* Material overview */}
                  <div>
                    <h3 className="hidden lg:block text-lg font-semibold text-gray-900 mb-4">
                      Overview
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            Key Points
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-11">
                          {material.keyPoints.length} konsep penting
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Code className="w-4 h-4 text-green-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            Practice
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-11">
                          {relatedExercises.length} latihan tersedia
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Key Points
                    </h3>
                    <div className="space-y-3">
                      {material.keyPoints.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Next Steps
                    </h3>
                    <div className="space-y-2">
                      {material.nextSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Exercises */}
                  {relatedExercises.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Latihan Terkait
                      </h3>
                      <div className="space-y-3">
                        {relatedExercises.map((exercise) => (
                          <button
                            key={exercise.id}
                            onClick={() =>
                              router.push(`/exercise/${exercise.id}`)
                            }
                            className="w-full text-left p-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                  <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 text-sm truncate">
                                    {exercise.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                  Level: {exercise.difficulty}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        )}

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Article Header */}
            <header className="bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span className="truncate">{material.category}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                    {material.title}
                  </h1>
                  <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed">
                    {material.description}
                  </p>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                {formatContent(material.content)}
              </div>

              {/* Code Example */}
              {material.codeExample && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                    Complete Code Example
                  </h3>
                  <div className="bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 font-medium">
                      Python Code - Full Example
                    </div>
                    <div
                      className="px-4"
                      style={{
                        height: `${calculateEditorHeight(
                          material.codeExample,
                        )}px`,
                      }}
                    >
                      <MonacoEditor
                        height="100%"
                        language="python"
                        value={material.codeExample}
                        theme="vs-dark"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                          lineNumbers: "off",
                          folding: false,
                          glyphMargin: false,
                          lineDecorationsWidth: 0,
                          padding: { top: 16, bottom: 16 },
                          overviewRulerBorder: false,
                          overviewRulerLanes: 0,
                          hideCursorInOverviewRuler: true,
                          scrollbar: {
                            vertical: "auto",
                            horizontal: "auto",
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                {!isCompleted ? (
                  <button
                    onClick={markAsCompleted}
                    className="flex-1 bg-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Mark as Completed</span>
                  </button>
                ) : (
                  <div className="flex-1 bg-green-50 border-2 border-green-200 text-green-800 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span>Completed</span>
                  </div>
                )}

                {relatedExercises.length > 0 && (
                  <button
                    onClick={() =>
                      router.push(`/exercise/${relatedExercises[0].id}`)
                    }
                    className="flex-1 bg-gray-100 text-gray-800 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Practice Now</span>
                  </button>
                )}
              </div>
            </div>
          </motion.article>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
