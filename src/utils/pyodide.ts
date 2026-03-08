"use client";

export type PyodideInstance = {
  runPython: <T = unknown>(code: string) => T;
  loadPackage: (packages: string[] | string) => Promise<void>;
};

const PYODIDE_VERSION = "v0.24.1";
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_BASE_URL}pyodide.js`;

let scriptLoadPromise: Promise<void> | null = null;
let pyodideInitPromise: Promise<PyodideInstance> | null = null;

function ensurePyodideScriptLoaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Pyodide can only be loaded in the browser"),
    );
  }

  if (typeof window.loadPyodide === "function") {
    return Promise.resolve();
  }

  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PYODIDE_SCRIPT_URL}"]`,
    );

    if (existing) {
      const onLoad = () => resolve();
      const onError = () => reject(new Error("Failed to load Pyodide script"));

      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export async function getPyodide(): Promise<PyodideInstance> {
  if (pyodideInitPromise) return pyodideInitPromise;

  pyodideInitPromise = (async () => {
    await ensurePyodideScriptLoaded();

    if (typeof window.loadPyodide !== "function") {
      throw new Error(
        "Pyodide script loaded, but window.loadPyodide is missing",
      );
    }

    // Ensure asset fetches (python stdlib, wasm, etc.) come from the same base URL.
    const pyodide = await window.loadPyodide({ indexURL: PYODIDE_BASE_URL });

    return pyodide as unknown as PyodideInstance;
  })();

  return pyodideInitPromise;
}

export function preloadPyodide(): void {
  void getPyodide();
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide?: (options?: { indexURL?: string }) => Promise<any>;
  }
}
