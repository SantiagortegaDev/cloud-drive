import { useState } from "react";
import Sidebar from "./explorer/Sidebar";
import Toolbar from "./explorer/Toolbar";
import DetailView from "./explorer/DetailView";
import TitleBar from "./explorer/TitleBar";
import AddressBar from "./explorer/AddressBar";
import { FileItem, FolderStructure } from "@/types/files";

const cloudFiles: FolderStructure = {
  "Cloud Drive": {
    "Documents": {
      files: [
        { name: "Project Proposal.docx", modified: "2026-03-18 09:14 AM", type: "Microsoft Word Document", size: "2.4 MB", icon: "doc" },
        { name: "Budget Report Q1.xlsx", modified: "2026-03-20 02:30 PM", type: "Microsoft Excel Spreadsheet", size: "1.8 MB", icon: "xls" },
        { name: "Meeting Notes.pdf", modified: "2026-03-21 11:05 AM", type: "PDF Document", size: "845 KB", icon: "pdf" },
        { name: "Contracts", modified: "2026-03-15 04:22 PM", type: "File folder", size: "", icon: "folder", isFolder: true },
        { name: "Resume - Final.pdf", modified: "2026-02-28 08:45 AM", type: "PDF Document", size: "1.2 MB", icon: "pdf" },
        { name: "Tax Records 2025.pdf", modified: "2026-01-14 03:10 PM", type: "PDF Document", size: "3.7 MB", icon: "pdf" },
      ],
      subfolders: {
        "Contracts": {
          files: [
            { name: "NDA_ClientA.pdf", modified: "2026-03-10 10:00 AM", type: "PDF Document", size: "420 KB", icon: "pdf" },
            { name: "Service Agreement.docx", modified: "2026-02-22 01:15 PM", type: "Microsoft Word Document", size: "890 KB", icon: "doc" },
          ]
        }
      }
    },
    "Photos": {
      files: [
        { name: "Vacation 2025", modified: "2025-12-28 06:30 PM", type: "File folder", size: "", icon: "folder", isFolder: true },
        { name: "Profile Picture.jpg", modified: "2026-01-05 09:20 AM", type: "JPEG Image", size: "4.2 MB", icon: "img" },
        { name: "Screenshot_2026-03-19.png", modified: "2026-03-19 03:45 PM", type: "PNG Image", size: "1.9 MB", icon: "img" },
        { name: "Family Dinner.heic", modified: "2026-03-14 08:12 PM", type: "HEIC Image", size: "6.1 MB", icon: "img" },
        { name: "Logo Design v3.svg", modified: "2026-03-08 11:30 AM", type: "SVG Image", size: "124 KB", icon: "img" },
      ],
      subfolders: {
        "Vacation 2025": {
          files: [
            { name: "DSC_0421.jpg", modified: "2025-12-25 10:30 AM", type: "JPEG Image", size: "5.8 MB", icon: "img" },
            { name: "DSC_0422.jpg", modified: "2025-12-25 10:32 AM", type: "JPEG Image", size: "5.4 MB", icon: "img" },
            { name: "DSC_0423.jpg", modified: "2025-12-26 02:15 PM", type: "JPEG Image", size: "6.2 MB", icon: "img" },
          ]
        }
      }
    },
    "Videos": {
      files: [
        { name: "Screen Recording 03-21.mp4", modified: "2026-03-21 04:00 PM", type: "MP4 Video", size: "124.5 MB", icon: "video" },
        { name: "Presentation Demo.mp4", modified: "2026-03-12 09:50 AM", type: "MP4 Video", size: "87.3 MB", icon: "video" },
        { name: "Birthday Clip.mov", modified: "2026-02-14 07:30 PM", type: "QuickTime Movie", size: "256.8 MB", icon: "video" },
      ]
    },
    "Music": {
      files: [
        { name: "Playlist Export.m3u", modified: "2026-03-01 12:00 PM", type: "M3U Playlist", size: "2 KB", icon: "music" },
        { name: "Podcast Episode 47.mp3", modified: "2026-03-18 06:00 AM", type: "MP3 Audio", size: "45.6 MB", icon: "music" },
        { name: "Voice Memo 2026-03-20.m4a", modified: "2026-03-20 05:15 PM", type: "M4A Audio", size: "8.3 MB", icon: "music" },
      ]
    },
    "Downloads": {
      files: [
        { name: "installer_v4.2.exe", modified: "2026-03-22 08:00 AM", type: "Application", size: "67.2 MB", icon: "exe" },
        { name: "archive_backup.zip", modified: "2026-03-19 10:30 AM", type: "ZIP Archive", size: "342.1 MB", icon: "zip" },
        { name: "font-pack.zip", modified: "2026-03-15 02:45 PM", type: "ZIP Archive", size: "18.9 MB", icon: "zip" },
        { name: "README.md", modified: "2026-03-20 09:00 AM", type: "Markdown File", size: "4 KB", icon: "text" },
        { name: "data_export.csv", modified: "2026-03-17 11:20 AM", type: "CSV File", size: "12.4 MB", icon: "text" },
      ]
    },
    "Shared": {
      files: [
        { name: "Team Roadmap.pptx", modified: "2026-03-21 10:00 AM", type: "PowerPoint Presentation", size: "8.5 MB", icon: "ppt" },
        { name: "Design Assets", modified: "2026-03-16 03:30 PM", type: "File folder", size: "", icon: "folder", isFolder: true },
        { name: "Brand Guidelines.pdf", modified: "2026-03-10 09:00 AM", type: "PDF Document", size: "14.2 MB", icon: "pdf" },
      ],
      subfolders: {
        "Design Assets": {
          files: [
            { name: "icon-set.fig", modified: "2026-03-16 03:30 PM", type: "Figma File", size: "2.1 MB", icon: "doc" },
            { name: "mockups.sketch", modified: "2026-03-14 01:00 PM", type: "Sketch File", size: "34.7 MB", icon: "doc" },
          ]
        }
      }
    },
  },
};

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(["Cloud Drive", "Documents"]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof FileItem>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const getCurrentFiles = (): FileItem[] => {
    let current: any = cloudFiles;
    for (let i = 0; i < currentPath.length; i++) {
      const key = currentPath[i];
      if (i === 0) {
        current = current[key];
      } else {
        if (current.subfolders && current.subfolders[key]) {
          current = current.subfolders[key];
        } else if (current[key]) {
          current = current[key];
        }
      }
    }
    return current?.files || [];
  };

  const getSubfolders = (): string[] => {
    return Object.keys(cloudFiles["Cloud Drive"]);
  };

  const files = getCurrentFiles();

  const sortedFiles = [...files].sort((a, b) => {
    // Folders always first
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;

    let valA = String(a[sortColumn] || "");
    let valB = String(b[sortColumn] || "");

    if (sortColumn === "size") {
      const parseSize = (s: string) => {
        if (!s) return 0;
        const num = parseFloat(s);
        if (s.includes("GB")) return num * 1024 * 1024;
        if (s.includes("MB")) return num * 1024;
        if (s.includes("KB")) return num;
        return num;
      };
      return sortAsc ? parseSize(valA) - parseSize(valB) : parseSize(valB) - parseSize(valA);
    }

    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (column: keyof FileItem) => {
    if (sortColumn === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(column);
      setSortAsc(true);
    }
  };

  const navigateTo = (path: string[]) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.isFolder) {
      setCurrentPath([...currentPath, file.name]);
      setSelectedFile(null);
    }
  };

  const totalItems = files.length;
  const selectedCount = selectedFile ? 1 : 0;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TitleBar />
      <div className="flex flex-1 flex-col overflow-hidden rounded-b-lg border border-win-divider bg-win-mica">
        <Toolbar currentPath={currentPath} onNavigate={navigateTo} />
        <AddressBar currentPath={currentPath} onNavigate={navigateTo} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            folders={getSubfolders()}
            currentPath={currentPath}
            onNavigate={navigateTo}
          />
          <div className="h-full w-px bg-win-divider" />
          <DetailView
            files={sortedFiles}
            selectedFile={selectedFile}
            onSelect={setSelectedFile}
            onDoubleClick={handleFileDoubleClick}
            sortColumn={sortColumn}
            sortAsc={sortAsc}
            onSort={handleSort}
          />
        </div>
        {/* Status bar */}
        <div className="flex h-7 items-center justify-between border-t border-win-divider bg-win-mica px-4 text-xs text-win-text-secondary">
          <span>{totalItems} items{selectedCount > 0 ? ` | ${selectedCount} selected` : ""}</span>
          <span>☁ Cloud Drive</span>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
