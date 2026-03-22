import { useState, useEffect } from "react";
import { X, Folder, ChevronRight, Loader2 } from "lucide-react";
import { supabase, DbFolder } from "@/lib/supabase";

interface MoveToModalProps {
  itemName: string;
  currentFolderId: string | null;
  excludeFolderId?: string;
  onClose: () => void;
  onMove: (targetFolderId: string) => void;
}

const MoveToModal = ({ itemName, currentFolderId, excludeFolderId, onClose, onMove }: MoveToModalProps) => {
  const [folders, setFolders] = useState<DbFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [subfolders, setSubfolders] = useState<Record<string, DbFolder[]>>({});

  useEffect(() => {
    loadRootFolders();
  }, []);

  const loadRootFolders = async () => {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .is("parent_id", null)
      .order("name");
    
    if (data) {
      setFolders(data.filter(f => f.id !== excludeFolderId));
    }
    setLoading(false);
  };

  const loadSubfolders = async (folderId: string) => {
    if (subfolders[folderId]) return;

    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("parent_id", folderId)
      .order("name");
    
    if (data) {
      setSubfolders(prev => ({
        ...prev,
        [folderId]: data.filter(f => f.id !== excludeFolderId)
      }));
    }
  };

  const toggleExpand = async (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
      await loadSubfolders(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleMove = async () => {
    if (!selectedFolderId) return;
    setMoving(true);
    await onMove(selectedFolderId);
    setMoving(false);
  };

  const renderFolder = (folder: DbFolder, depth: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const isCurrent = folder.id === currentFolderId;
    const children = subfolders[folder.id] || [];

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-1 py-1.5 px-2 cursor-pointer rounded transition-colors ${
            isSelected ? "bg-win-accent text-white" : isCurrent ? "bg-win-surface-hover opacity-50" : "hover:bg-win-surface-hover"
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => !isCurrent && setSelectedFolderId(folder.id)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(folder.id);
            }}
            className="p-0.5 hover:bg-win-divider rounded"
          >
            <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>
          <Folder className="h-4 w-4 text-amber-400" />
          <span className="text-sm truncate">{folder.name}</span>
          {isCurrent && <span className="ml-auto text-xs opacity-60">(current)</span>}
        </div>
        {isExpanded && children.map(child => renderFolder(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-win-divider bg-win-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-win-text-primary">
            Move "{itemName}"
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-win-text-secondary hover:bg-win-surface-hover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-sm text-win-text-secondary">Select destination folder:</p>

        <div className="mb-4 max-h-64 overflow-y-auto rounded-md border border-win-divider bg-win-mica p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-win-accent" />
            </div>
          ) : (
            folders.map(folder => renderFolder(folder))
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-win-divider px-4 py-2 text-sm text-win-text-secondary hover:bg-win-surface-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={moving || !selectedFolderId || selectedFolderId === currentFolderId}
            className="rounded-md bg-win-accent px-4 py-2 text-sm text-white hover:bg-win-accent-hover disabled:opacity-50"
          >
            {moving ? "Moving..." : "Move Here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveToModal;
