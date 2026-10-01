"use client";

import { useState } from "react";
import JSZip from "jszip";

interface DownloadButtonProps {
  files: Record<string, string>;
}

export function DownloadButton({ files }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // Add every generated file to the zip
      Object.entries(files).forEach(([path, content]) => {
        // Normalize path (remove leading slash if present)
        const cleanPath = path.replace(/^\//, "");
        zip.file(cleanPath, content);
      });

      // Generate the zip
      const blob = await zip.generateAsync({ type: "blob" });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-app-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to create ZIP. Check the console.");
    } finally {
      setIsDownloading(false);
    }
  };

  const fileCount = Object.keys(files).length;

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 rounded-lg text-sm font-medium transition"
    >
      {isDownloading ? (
        "Creating ZIP..."
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download ZIP ({fileCount} files)
        </>
      )}
    </button>
  );
}
