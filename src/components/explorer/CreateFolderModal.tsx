"use client";

import { useState } from "react";
import { X, FolderPlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CreateFolderModalProps {
  currentFolderId: string | null;
  onClose: () => void;
  onComplete: () => void;
}

const CreateFolderModal = ({ currentFolderId, onClose, onComplete }: CreateFolderModalProps) => {
  const [folderName, setFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError("Please enter a folder name");
      return;
    }

    if (!currentFolderId) {
      setError("Please select a parent folder first");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from("folders").insert({
        name: folderName.trim(),
        parent_id: currentFolderId,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-win-divider bg-win-mica p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-win-text-primary">New Folder</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-win-text-secondary hover:bg-win-surface-hover hover:text-win-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-win-divider bg-win-surface p-3">
            <FolderPlus className="h-8 w-8 text-amber-400" />
            <input
              type="text"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError("");
              }}
              placeholder="Folder name"
              autoFocus
              className="flex-1 bg-transparent text-sm text-win-text-primary placeholder:text-win-text-secondary focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-win-divider px-4 py-2 text-sm font-medium text-win-text-primary hover:bg-win-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 rounded-lg bg-win-accent px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-win-accent-hover disabled:opacity-50"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
