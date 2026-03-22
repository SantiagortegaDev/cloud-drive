"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UploadModalProps {
  currentFolderId: string | null;
  onClose: () => void;
  onComplete: () => void;
}

const getFileIcon = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  
  const iconMap: Record<string, string> = {
    // Documents
    doc: "doc", docx: "doc", pdf: "pdf", txt: "text", md: "text",
    xls: "xls", xlsx: "xls", csv: "xls",
    ppt: "ppt", pptx: "ppt",
    // Images
    jpg: "img", jpeg: "img", png: "img", gif: "img", webp: "img", svg: "img", heic: "img", bmp: "img",
    // Videos
    mp4: "video", mov: "video", avi: "video", mkv: "video", webm: "video",
    // Audio
    mp3: "music", wav: "music", m4a: "music", flac: "music", aac: "music",
    // Archives
    zip: "zip", rar: "zip", "7z": "zip", tar: "zip", gz: "zip",
    // Executables
    exe: "exe", msi: "exe", dmg: "exe", app: "exe",
  };
  
  return iconMap[ext] || "text";
};

const getFileType = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  
  const typeMap: Record<string, string> = {
    doc: "Microsoft Word Document", docx: "Microsoft Word Document",
    pdf: "PDF Document",
    txt: "Text File", md: "Markdown File",
    xls: "Microsoft Excel Spreadsheet", xlsx: "Microsoft Excel Spreadsheet", csv: "CSV File",
    ppt: "PowerPoint Presentation", pptx: "PowerPoint Presentation",
    jpg: "JPEG Image", jpeg: "JPEG Image", png: "PNG Image", gif: "GIF Image", 
    webp: "WebP Image", svg: "SVG Image", heic: "HEIC Image", bmp: "Bitmap Image",
    mp4: "MP4 Video", mov: "QuickTime Movie", avi: "AVI Video", mkv: "MKV Video", webm: "WebM Video",
    mp3: "MP3 Audio", wav: "WAV Audio", m4a: "M4A Audio", flac: "FLAC Audio", aac: "AAC Audio",
    zip: "ZIP Archive", rar: "RAR Archive", "7z": "7-Zip Archive", tar: "TAR Archive", gz: "GZip Archive",
    exe: "Application", msi: "Windows Installer", dmg: "macOS Disk Image", app: "Application",
  };
  
  return typeMap[ext] || "File";
};

const UploadModal = ({ currentFolderId, onClose, onComplete }: UploadModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    if (!file) return;
    if (!currentFolderId) {
      setStatus("error");
      setMessage("Please select a folder first");
      return;
    }

    setUploading(true);
    setStatus("uploading");
    setMessage(`Uploading ${file.name}...`);
    setProgress(10);

    try {
      // Upload to Catbox
      const formData = new FormData();
      formData.append("reqtype", "fileupload");
      formData.append("fileToUpload", file);

      setProgress(30);

      const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData,
      });

      setProgress(70);

      const link = await response.text();

      if (link.startsWith("https://files.catbox.moe/")) {
        setProgress(85);
        
        // Save to Supabase
        const { error } = await supabase.from("files").insert({
          name: file.name,
          url: link,
          folder_id: currentFolderId,
          size_bytes: file.size,
          file_type: getFileType(file.name),
          icon: getFileIcon(file.name),
        });

        if (error) {
          throw new Error("Failed to save file to database");
        }

        setProgress(100);
        setStatus("success");
        setMessage(`${file.name} uploaded successfully!`);
        
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        throw new Error(link || "Upload failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-win-divider bg-win-mica p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-win-text-primary">Upload File</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-win-text-secondary hover:bg-win-surface-hover hover:text-win-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          onClick={handleFileSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            status === "uploading"
              ? "border-win-accent bg-win-accent/5"
              : "border-win-divider hover:border-win-accent hover:bg-win-surface-hover"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          {status === "idle" && (
            <>
              <Upload className="mb-3 h-10 w-10 text-win-text-secondary" />
              <p className="mb-1 text-sm font-medium text-win-text-primary">
                Click to select or drag and drop
              </p>
              <p className="text-xs text-win-text-secondary">
                Max 200 MB per file
              </p>
            </>
          )}

          {status === "uploading" && (
            <>
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-win-accent" />
              <p className="mb-2 text-sm font-medium text-win-text-primary">
                {message}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-win-divider">
                <div
                  className="h-full bg-win-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="mb-3 h-10 w-10 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-500">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
              <p className="text-sm font-medium text-red-500">{message}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus("idle");
                  setMessage("");
                }}
                className="mt-3 rounded-lg bg-win-surface px-4 py-2 text-xs font-medium text-win-text-primary hover:bg-win-surface-hover"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
