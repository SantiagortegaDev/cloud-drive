"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./explorer/Sidebar";
import Toolbar from "./explorer/Toolbar";
import DetailView from "./explorer/DetailView";
import TitleBar from "./explorer/TitleBar";
import AddressBar from "./explorer/AddressBar";
import UploadModal from "./explorer/UploadModal";
import CreateFolderModal from "./explorer/CreateFolderModal";
import { FileItem } from "@/types/files";
import { supabase, DbFolder, DbFile } from "@/lib/supabase";

const FileExplorer = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Cloud Drive" }
  ]);
  const [folders, setFolders] = useState<DbFolder[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof FileItem>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [rootFolders, setRootFolders] = useState<DbFolder[]>([]);

  // Load root folders for sidebar
  const loadRootFolders = useCallback(async () => {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .is("parent_id", null)
      .order("name");
    
    if (data) {
      setRootFolders(data);
      // If no folder is selected, select the first one
      if (!currentFolderId && data.length > 0) {
        setCurrentFolderId(data[0].id);
        setCurrentPath([
          { id: null, name: "Cloud Drive" },
          { id: data[0].id, name: data[0].name }
        ]);
      }
    }
  }, [currentFolderId]);

  // Load content for current folder
  const loadFolderContent = useCallback(async () => {
    if (!currentFolderId) {
      setFiles([]);
      setFolders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Load subfolders
    const { data: subfolders } = await supabase
      .from("folders")
      .select("*")
      .eq("parent_id", currentFolderId)
      .order("name");

    // Load files
    const { data: dbFiles } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", currentFolderId)
      .order("name");

    if (subfolders) {
      setFolders(subfolders);
    }

    const folderItems: FileItem[] = (subfolders || []).map((f) => ({
      id: f.id,
      name: f.name,
      modified: new Date(f.created_at).toLocaleString(),
      type: "File folder",
      size: "",
      icon: "folder",
      isFolder: true,
      folderId: f.parent_id,
    }));

    const fileItems: FileItem[] = (dbFiles || []).map((f) => ({
      id: f.id,
      name: f.name,
      modified: new Date(f.created_at).toLocaleString(),
      type: f.file_type || "File",
      size: formatSize(f.size_bytes),
      icon: f.icon || "text",
      url: f.url,
      folderId: f.folder_id,
    }));

    setFiles([...folderItems, ...fileItems]);
    setLoading(false);
  }, [currentFolderId]);

  useEffect(() => {
    loadRootFolders();
  }, [loadRootFolders]);

  useEffect(() => {
    loadFolderContent();
  }, [loadFolderContent]);

  const formatSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

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

  const navigateToFolder = async (folderId: string | null, folderName: string) => {
    if (folderId === null) {
      // Going back to root - select first root folder
      if (rootFolders.length > 0) {
        setCurrentFolderId(rootFolders[0].id);
        setCurrentPath([
          { id: null, name: "Cloud Drive" },
          { id: rootFolders[0].id, name: rootFolders[0].name }
        ]);
      }
      return;
    }
    
    setCurrentFolderId(folderId);
    
    // Build path by traversing parent folders
    const newPath: { id: string | null; name: string }[] = [{ id: null, name: "Cloud Drive" }];
    
    // Get all parent folders
    let currentId: string | null = folderId;
    const pathIds: { id: string; name: string }[] = [];
    
    while (currentId) {
      const { data: folder } = await supabase
        .from("folders")
        .select("*")
        .eq("id", currentId)
        .single();
      
      if (folder) {
        pathIds.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parent_id;
      } else {
        break;
      }
    }
    
    setCurrentPath([...newPath, ...pathIds]);
    setSelectedFile(null);
  };

  const navigateToRootFolder = (folder: DbFolder) => {
    setCurrentFolderId(folder.id);
    setCurrentPath([
      { id: null, name: "Cloud Drive" },
      { id: folder.id, name: folder.name }
    ]);
    setSelectedFile(null);
  };

  const handleFileDoubleClick = async (file: FileItem) => {
    if (file.isFolder) {
      await navigateToFolder(file.id, file.name);
    } else if (file.url) {
      // Download file
      window.open(file.url, "_blank");
    }
  };

  const goBack = () => {
    if (currentPath.length > 2) {
      const newPath = currentPath.slice(0, -1);
      const parentFolder = newPath[newPath.length - 1];
      setCurrentFolderId(parentFolder.id);
      setCurrentPath(newPath);
    } else if (currentPath.length === 2) {
      // At root folder level, can't go back further
    }
  };

  const goUp = goBack;

  const handleUploadComplete = () => {
    loadFolderContent();
    setShowUploadModal(false);
  };

  const handleCreateFolderComplete = () => {
    loadFolderContent();
    setShowCreateFolderModal(false);
  };

  const refresh = () => {
    loadFolderContent();
    loadRootFolders();
  };

  const totalItems = files.length;
  const selectedCount = selectedFile ? 1 : 0;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TitleBar />
      <div className="flex flex-1 flex-col overflow-hidden rounded-b-lg border border-win-divider bg-win-mica">
        <Toolbar 
          currentPath={currentPath} 
          onNavigate={navigateToFolder}
          onGoBack={goBack}
          onGoUp={goUp}
          onRefresh={refresh}
          onNewFile={() => setShowUploadModal(true)}
          onNewFolder={() => setShowCreateFolderModal(true)}
          canGoBack={currentPath.length > 2}
          canGoUp={currentPath.length > 2}
        />
        <AddressBar currentPath={currentPath.map(p => p.name)} onNavigate={(pathNames) => {
          // Navigate to specific path index
          const idx = pathNames.length - 1;
          if (idx >= 0 && idx < currentPath.length) {
            const target = currentPath[idx];
            if (target.id) {
              navigateToFolder(target.id, target.name);
            }
          }
        }} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            folders={rootFolders}
            currentFolderId={currentFolderId}
            onNavigate={navigateToRootFolder}
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
            loading={loading}
          />
        </div>
        {/* Status bar */}
        <div className="flex h-7 items-center justify-between border-t border-win-divider bg-win-mica px-4 text-xs text-win-text-secondary">
          <span>{totalItems} items{selectedCount > 0 ? ` | ${selectedCount} selected` : ""}</span>
          <span>Cloud Drive</span>
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          currentFolderId={currentFolderId}
          onClose={() => setShowUploadModal(false)}
          onComplete={handleUploadComplete}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal
          currentFolderId={currentFolderId}
          onClose={() => setShowCreateFolderModal(false)}
          onComplete={handleCreateFolderComplete}
        />
      )}
    </div>
  );
};

export default FileExplorer;
