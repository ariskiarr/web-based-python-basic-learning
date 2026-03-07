"use client";

import { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Play, RotateCcw, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface CodeEditorProps {
  initialCode: string;
  onCodeChange: (code: string) => void;
  onRun: (code: string) => void;
  isRunning: boolean;
  output: string;
  hasError: boolean;
}

export default function CodeEditor({
  initialCode,
  onCodeChange,
  onRun,
  isRunning,
  output,
  hasError,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<unknown>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorDidMount = (editor: unknown) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Configure editor options for mobile optimization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorInstance = editor as any;
    editorInstance.updateOptions({
      fontSize: 12,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: "on",
      lineNumbers: "on",
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 2,
      renderLineHighlight: "line",
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: "line",
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleRun = () => {
    if (!isRunning && code.trim()) {
      onRun(code);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    onCodeChange(initialCode);
  };

  const formatCode = () => {
    if (editorRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const editorInstance = editorRef.current as any;
      editorInstance.getAction("editor.action.formatDocument").run();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[400px] sm:min-h-[500px]">
      {/* Editor Header */}
      <div className="bg-gray-50 border-b px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 ml-2 hidden xs:inline">
            Python Editor
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={formatCode}
            disabled={!isEditorReady}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
          >
            Format
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden xs:inline">Reset</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className={`px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded flex items-center gap-1 sm:gap-2 transition-colors ${
              isRunning
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="hidden xs:inline">Running...</span>
                <span className="xs:hidden">...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Run</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative min-h-[200px]">
        <Editor
          height="100%"
          language="python"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-light"
          options={{
            fontSize: 12,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 5,
            lineNumbersMinChars: 2,
            renderLineHighlight: "line",
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            automaticLayout: true,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 8, bottom: 8 },
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Output Console */}
      <div className="border-t bg-gray-900 text-green-400 font-mono text-xs sm:text-sm flex-shrink-0">
        <div className="px-3 sm:px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <span className="text-gray-300 font-medium text-xs sm:text-sm">
            <span className="hidden sm:inline">Output Console</span>
            <span className="sm:hidden">Output</span>
          </span>
          <div className="flex items-center gap-2">
            {output &&
              (hasError ? (
                <div className="flex items-center gap-1 text-red-400">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs">Error</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs">Success</span>
                </div>
              ))}
          </div>
        </div>

        <div className="p-3 sm:p-4 h-20 sm:h-24 overflow-y-auto">
          {isRunning ? (
            <div className="flex items-center gap-2 text-yellow-400">
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              <span className="text-xs sm:text-sm">Executing code...</span>
            </div>
          ) : output ? (
            <pre
              className={`whitespace-pre-wrap text-xs sm:text-sm ${
                hasError ? "text-red-400" : "text-green-400"
              }`}
            >
              {output}
            </pre>
          ) : (
            <div className="text-gray-500 italic text-xs sm:text-sm">
              <span className="hidden sm:inline">
                Tekan tombol &quot;Run&quot; untuk mengeksekusi kode kamu...
              </span>
              <span className="sm:hidden">
                Tekan &quot;Run&quot; untuk eksekusi kode...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
