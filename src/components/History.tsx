"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { userProgressManager, type UserAttempt } from "@/utils/userProgress";
import {
  History,
  CheckCircle,
  XCircle,
  Calendar,
  Code,
  Trophy,
  Clock,
  Star,
} from "lucide-react";

export default function HistoryComponent() {
  const [history, setHistory] = useState<UserAttempt[]>([]);
  const [progress, setProgress] = useState({
    totalExercises: 0,
    completedExercises: 0,
    totalXP: 0,
    level: 1,
    percentage: 0,
  });

  useEffect(() => {
    const userHistory = userProgressManager.getRecentHistory(20);
    const userProgress = userProgressManager.getOverallProgress();

    setHistory(userHistory);
    setProgress(userProgress);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCode = (code: string, maxLength: number = 100) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          Progress Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600">
              {progress.completedExercises}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Latihan Selesai
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {progress.totalXP}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total XP</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {progress.level}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Level</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-amber-700">
              {progress.percentage.toFixed(0)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Progress</div>
          </div>
        </div>
      </motion.div>

      {/* History List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <History className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
          Riwayat Latihan
        </h2>

        {history.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <History className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-500">
              Belum ada riwayat latihan
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Mulai mengerjakan latihan untuk melihat riwayat di sini
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {history.map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-3 sm:p-4 ${
                  attempt.success
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {attempt.exerciseTitle}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {attempt.success ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs font-medium">
                              Berhasil
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs font-medium">Gagal</span>
                          </div>
                        )}
                        {attempt.success && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs font-medium">
                              {attempt.score} XP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">
                          {formatTimestamp(attempt.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">
                          Exercise #{attempt.exerciseId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Preview */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Kode:
                    </span>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {formatCode(
                        attempt.code,
                        window.innerWidth < 640 ? 50 : 100
                      )}
                    </pre>
                  </div>
                </div>

                {/* Output */}
                {attempt.output && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Output:
                      </span>
                    </div>
                    <div
                      className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono overflow-x-auto ${
                        attempt.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <pre className="whitespace-pre-wrap">
                        {formatCode(attempt.output, 200)}
                      </pre>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
